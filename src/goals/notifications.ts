import { subtractDays } from './dates'
import { loadFiredReminders, saveFiredReminders } from './storage'
import type { Goal } from './types'

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    return 'unsupported'
  }
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch {
    return 'denied'
  }
}

export type ScheduledReminder = {
  key: string
  title: string
  body: string
  datetime: Date
  dateStr: string
  timeStr: string
}

export function getScheduledReminder(goal: Goal): ScheduledReminder | null {
  if (!goal.reminder.enabled || goal.reminder.option === 'none' || goal.completed) {
    return null
  }

  const time = goal.reminder.time || '09:00'
  let targetDate = ''
  let label = ''

  switch (goal.reminder.option) {
    case 'start_date':
      targetDate = goal.startDate
      label = `Your goal "${goal.title}" starts today!`
      break
    case '1_day_before':
      targetDate = subtractDays(goal.endDate, 1)
      label = `Your goal "${goal.title}" deadline is tomorrow!`
      break
    case '3_days_before':
      targetDate = subtractDays(goal.endDate, 3)
      label = `Your goal "${goal.title}" deadline is in 3 days.`
      break
    case '7_days_before':
      targetDate = subtractDays(goal.endDate, 7)
      label = `Your goal "${goal.title}" deadline is in 7 days.`
      break
    case 'custom':
      if (!goal.reminder.customDate) return null
      targetDate = goal.reminder.customDate
      label = `Reminder for your goal "${goal.title}".`
      break
    default:
      return null
  }

  if (!targetDate) return null

  const [year, month, day] = targetDate.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const datetime = new Date(year, month - 1, day, hours, minutes, 0, 0)

  // Append milestone info if enabled
  let body = label
  if (goal.reminder.remindMilestones && goal.milestones.length > 0) {
    const pending = goal.milestones.filter((m) => !m.completed).length
    if (pending > 0) {
      body += ` You have ${pending} pending milestone${pending === 1 ? '' : 's'}.`
    }
  }

  // Key uniquely identifies this specific goal reminder instance to avoid duplicate fires
  const key = `${goal.id}:${goal.reminder.option}:${targetDate}:${time}`

  return {
    key,
    title: `Goal Reminder · ${goal.title}`,
    body,
    datetime,
    dateStr: targetDate,
    timeStr: time,
  }
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!isNotificationSupported()) {
    return false
  }

  if (Notification.permission !== 'granted') {
    return false
  }

  try {
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    })
    return true
  } catch {
    return false
  }
}

export async function sendTestNotification(): Promise<{
  success: boolean
  message: string
}> {
  if (!isNotificationSupported()) {
    return {
      success: false,
      message: 'Browser notifications are not supported in this environment.',
    }
  }

  let permission = Notification.permission
  if (permission === 'default') {
    permission = await requestNotificationPermission() as NotificationPermission
  }

  if (permission !== 'granted') {
    return {
      success: false,
      message:
        'Notifications are blocked or denied. Please enable notification permissions in your browser address bar/settings.',
    }
  }

  const sent = sendBrowserNotification('LifeOS Goal Tracker 🎯', {
    body: 'Browser notifications are successfully configured and working!',
  })

  if (sent) {
    return {
      success: true,
      message: 'Test notification sent! Check your desktop notifications.',
    }
  }

  return {
    success: false,
    message: 'Failed to display notification. Check your system notification settings.',
  }
}

export function checkAndDispatchGoalReminders(
  goals: Goal[],
  now = new Date(),
): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return
  }

  const firedSet = loadFiredReminders()
  let newlyFired = false
  const currentTime = now.getTime()

  for (const goal of goals) {
    const reminder = getScheduledReminder(goal)
    if (!reminder) continue

    if (firedSet.has(reminder.key)) continue

    const reminderTime = reminder.datetime.getTime()

    // Trigger if current time is past or within 30 minutes of reminder time, but not older than 24 hours
    const isDue = currentTime >= reminderTime
    const isNotStale = currentTime - reminderTime < 24 * 60 * 60 * 1000

    if (isDue && isNotStale) {
      sendBrowserNotification(reminder.title, {
        body: reminder.body,
        tag: reminder.key,
      })
      firedSet.add(reminder.key)
      newlyFired = true
    }
  }

  if (newlyFired) {
    saveFiredReminders(firedSet)
  }
}
