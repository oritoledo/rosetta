import { useSettings } from '../../store/settingsStore'
import Toggle from './Toggle'
import SettingRow from './SettingRow'

const GOAL_OPTIONS = [5, 10, 15, 20, 30]
const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Cinzel, serif',
  fontSize: 9,
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  color: 'var(--lapis-bright)',
}

const card: React.CSSProperties = {
  background: 'var(--basalt-mid)',
  border: '1px solid rgba(232,238,245,0.07)',
  borderRadius: 18,
  padding: '20px 24px',
}

import React from 'react'

export default function LearningPanel({ id }: { id: string }) {
  const { settings, dispatchSettings } = useSettings()

  const goal = settings.dailyGoalMinutes
  const sceneAvg = 8
  const daysPerScene = Math.ceil(sceneAvg / goal)

  function toggleDay(day: string) {
    const current = settings.weeklyDays
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    dispatchSettings({ type: 'UPDATE_WEEKLY_DAYS', payload: next })
  }

  return (
    <section id={id}>
      <div style={sectionLabel}>Learning</div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(232,238,245,0.08)', margin: '10px 0 20px' }} />

      {/* Daily goal card */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'var(--lapis-bright)', marginBottom: 8 }}>
          Daily Goal
        </div>
        <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 20 }}>
          How many minutes do you want to practice each day?
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {GOAL_OPTIONS.map((mins) => {
            const active = goal === mins
            return (
              <button
                key={mins}
                onClick={() => dispatchSettings({ type: 'UPDATE_DAILY_GOAL', payload: mins })}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 14,
                  border: active ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(232,238,245,0.08)',
                  background: active ? 'var(--lapis-deep)' : 'var(--basalt-raised)',
                  boxShadow: active ? '0 0 14px rgba(5,150,105,0.25)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  transition: 'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
                }}
              >
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: active ? 'var(--moon-bright)' : 'var(--moon-dim)' }}>{mins}</span>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 7, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)' }}>min</span>
              </button>
            )
          })}
        </div>

        <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', textAlign: 'center' as const, marginTop: 12 }}>
          At {goal} min/day you'll complete a scene every {daysPerScene} day{daysPerScene !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Setting rows card */}
      <div style={card}>
        {/* Weekly target */}
        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(232,238,245,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, color: 'var(--moon)', marginBottom: 3 }}>Weekly Target</div>
              <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>How many days per week do you want to practice?</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {WEEK_DAYS.map((day) => {
              const active = settings.weeklyDays.includes(day)
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? 'var(--lapis)' : 'var(--basalt-raised)',
                    color: active ? 'var(--moon-bright)' : 'var(--muted)',
                    fontFamily: 'Cinzel, serif',
                    fontSize: 8,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  {DAY_LABELS[day]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Reminders */}
        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(232,238,245,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: settings.reminderEnabled ? 12 : 0 }}>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, color: 'var(--moon)', marginBottom: 3 }}>Session Reminders</div>
              <div style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>Remind me to practice at</div>
            </div>
            <Toggle
              value={settings.reminderEnabled}
              onChange={(v) => dispatchSettings({ type: 'UPDATE_REMINDER', payload: { enabled: v, time: settings.reminderTime } })}
            />
          </div>
          {settings.reminderEnabled && (
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => dispatchSettings({ type: 'UPDATE_REMINDER', payload: { enabled: true, time: e.target.value } })}
              style={{
                background: 'var(--basalt-raised)',
                border: '1px solid rgba(232,238,245,0.1)',
                borderRadius: 10,
                height: 38,
                padding: '0 12px',
                color: 'var(--moon)',
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: 13,
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          )}
        </div>

        <SettingRow
          label="Rest Day Message"
          description="Show a motivating message on rest days"
          control={
            <Toggle
              value={settings.restDayMessage}
              onChange={(v) => dispatchSettings({ type: 'SET_REST_DAY_MESSAGE', payload: v })}
            />
          }
        />

        <div style={{ padding: '14px 0' }}>
          <SettingRow
            label="Streak Freeze"
            description="Allow one missed day per week without breaking streak"
            last
            control={
              <Toggle
                value={settings.streakFreezeEnabled}
                onChange={(v) => dispatchSettings({ type: 'SET_STREAK_FREEZE', payload: v })}
              />
            }
          />
          {settings.streakFreezeEnabled && (
            <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: 10, fontStyle: 'italic', color: 'var(--muted)', marginTop: 6 }}>
              You have 1 freeze available this week
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
