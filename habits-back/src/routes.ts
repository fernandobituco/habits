import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { request } from 'http'
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()
        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                habitWeekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })

    app.get('/habits', async (request) => {
        const habits = await prisma.habit.findMany({
            include: {
                habitWeekDays: {
                    select: {
                        week_day: true
                    }
                }
            }
        })
        habits.forEach(habit => habit.habitWeekDays.map(habitWeekDays => (habitWeekDays.week_day)))
        const habitsModified = habits.map(habit => ({
            id: habit.id,
            title: habit.title,
            created_at: habit.created_at,
            habitWeekDays: habit.habitWeekDays.map(habitWeekDay => (habitWeekDay.week_day))
        }))
        return habitsModified
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                habitWeekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch('/habits', async (request) => {
        const habitIdParam = z.object({
            id: z.string().uuid(),
            date: z.coerce.date()
        })

        var { id, date } = habitIdParam.parse(request.body)
        if (date == null) {
            date = dayjs().startOf('day').toDate()
        }
        let day = await prisma.day.findUnique({
            where: {
                date: date
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: date
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
    })

    app.get('/summary', async (request) => {
        const summary = await prisma.$queryRaw`
            SELECT
                D.id,
                D.date,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D
        `

        return summary
    })

    app.patch('/habits/weekdays', async (request) => {
        const habitIdParam = z.object({
            habitId: z.string().uuid(),
            weekDay: z.number()
        })

        const { habitId, weekDay } = habitIdParam.parse(request.body)
        const habitWeekDay = await prisma.habitWeekDay.findFirst({
            where: {
                habit_id: habitId,
                week_day: weekDay
            }
        })

        if (!habitWeekDay) {
            await prisma.habitWeekDay.create({
                data: {
                    habit_id: habitId,
                    week_day: weekDay
                }
            })
        } else {
            await prisma.habitWeekDay.delete({
                where: {
                    id: habitWeekDay.id
                }
            })
        }

    })

    app.delete('/habits', async (request) => {
        const habitParam = z.object({
            habitId: z.string()
        })

        const habitId = habitParam.parse(request.query)

        await prisma.habitWeekDay.deleteMany({
            where: {
                habit_id: habitId.habitId
            }
        })

        await prisma.dayHabit.deleteMany({
            where: {
                habit_id: habitId.habitId
            }
        })

        await prisma.habit.delete({
            where: {
                id: habitId.habitId
            }
        })
    })
}

