import React, { useEffect, useState } from 'react'
import {
  getAdminRunners,
  getMyProfile,
  getMyTeammates,
  getPublicCharity,
  getPublicRace,
  getPublicSchedule,
  login,
  registerRunner,
} from './api'

const pages = ['home', 'login', 'register', 'dashboard', 'admin']

export default function App() {
  const [page, setPage] = useState('home')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [message, setMessage] = useState('')
  const [charity, setCharity] = useState(null)
  const [race, setRace] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [profile, setProfile] = useState(null)
  const [teammates, setTeammates] = useState([])
  const [adminRunners, setAdminRunners] = useState([])

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    age: '',
    emergencyPhone: '',
    password: '',
    teamName: '',
  })

  useEffect(() => {
    loadPublicData()
  }, [])

  useEffect(() => {
    if (token) {
      loadPrivateData(token)
    } else {
      setProfile(null)
      setTeammates([])
      setAdminRunners([])
    }
  }, [token])

  async function loadPublicData() {
    const [charityData, raceData, scheduleData] = await Promise.all([
      getPublicCharity(),
      getPublicRace(),
      getPublicSchedule(),
    ])

    setCharity(charityData)
    setRace(raceData)
    setSchedule(scheduleData)
  }

  async function loadPrivateData(currentToken) {
    const me = await getMyProfile(currentToken)
    setProfile(me)

    const mates = await getMyTeammates(currentToken)
    setTeammates(Array.isArray(mates) ? mates : [])

    if (me?.isAdmin) {
      const runners = await getAdminRunners(currentToken)
      setAdminRunners(Array.isArray(runners) ? runners : [])
    }
  }

    async function handleLogin(event) {
        event.preventDefault()
        setMessage('')

        const email = loginForm.email.trim()
        const password = loginForm.password.trim()

        if (!email || !password) {
            setMessage('Please enter both email and password.')
            return
        }

        if (!email.includes('@')) {
            setMessage('Please enter a valid email.')
            return
        }

        try {
            const result = await login(email, password)

            if (result.error) {
                setMessage(result.error)
                return
            }

            if (!result.token) {
                setMessage('Login failed. Please try again.')
                return
            }

            localStorage.setItem('token', result.token)
            setLoginForm({email: '',password: ''})
            setToken(result.token)
            setMessage('Login successful.')
            setPage('dashboard')

        } catch (error) {
            console.error(error)
            setMessage('Something went wrong. Please try again.')
        }
    }

    async function handleRegister(event) {
        event.preventDefault()
        setMessage('')

        const name = registerForm.name.trim()
        const email = registerForm.email.trim()
        const age = Number(registerForm.age)
        const emergencyPhone = registerForm.emergencyPhone.trim()
        const password = registerForm.password.trim()
        const teamName = registerForm.teamName.trim()

        if (!name || !email || !password || !registerForm.age) {
            setMessage('Please fill out all required fields.')
            return
        }

        if (!email.includes('@')) {
            setMessage('Please enter a valid email.')
            return
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters.')
            return
        }

        if (age <= 0) {
            setMessage('Enter a valid age.')
            return
        }

        if (emergencyPhone.length < 10) {
            setMessage('Enter a valid phone number.')
            return
        }

        const payload = {
            name,
            email,
            age,
            emergencyPhone,
            password,
            teamName,
        }

        const result = await registerRunner(payload)

        if (result.error) {
            setMessage(result.error)
            return
        }

        if (result.errors) {
            setMessage(result.errors.join(' '))
            return
        }

        setMessage('Registration successful.')
        setRegisterForm({
            name: '',
            email: '',
            age: '',
            emergencyPhone: '',
            password: '',
            teamName: '',
        })
        setPage('login')
    }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    setPage('home')
    setMessage('Logged out.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Charity Run Starter</h1>
          <p className="subtitle">A minimal starter for the 5K charity run project.</p>
        </div>

        <nav className="nav">
          {pages.map((item) => (
            <button key={item} onClick={() => setPage(item)} className={page === item ? 'active' : ''}>
              {item}
            </button>
          ))}
          {token && <button onClick={logout}>logout</button>}
        </nav>
      </header>

      {message && <div className="message-box">{message}</div>}

      {/*
        STUDENT TASK:
        Redesign the overall experience, not only the visual skin.

        This file is intentionally minimal so that you can apply design ideas from
        Designing the User Interface: Strategies for Effective Human-Computer Interaction.

        You have a lot of creative freedom. For example, you may redesign:
        - the navigation model
        - page hierarchy and information architecture
        - page layout and spacing system
        - color system, typography, and visual hierarchy
        - cards, tables, lists, forms, and error messages
        - responsive behavior for phone, tablet, and desktop
        - status feedback, transitions, and empty states

        You are NOT limited to "make it prettier" or "finish the missing features."
        You may substantially rethink how the interface works as long as it still
        supports the project requirements and uses the provided backend APIs.
      */}

      <main className="main-grid">
        {page === 'home' && (
          <section className="panel">
            <h2>Home</h2>
            <p>
              {/*
                STUDENT TASK:
                Replace this basic text block with a true public landing page.

                Design opportunities:
                - Create a stronger first impression for the charity mission.
                - Use better calls to action for Register and Login.
                - Present race date, location, and highlights in a scannable way.
                - Consider storytelling, hero sections, feature cards, FAQ, or timeline views.
                - Show mobile-friendly layouts, not just a desktop layout shrunk down.

                Related textbook ideas:
                - Strive for consistency
                - Offer informative feedback
                - Design dialogs to yield closure
                - Reduce short-term memory load

                You may reorganize this page completely. You do not need to keep this structure.
              */}
              This page currently shows raw starter content only.
            </p>

            <div className="card-grid">
              <article className="card">
                <h3>Charity</h3>
                <pre>{JSON.stringify(charity, null, 2)}</pre>
              </article>

              <article className="card">
                <h3>Race</h3>
                <pre>{JSON.stringify(race, null, 2)}</pre>
              </article>

              <article className="card wide-card">
                <h3>Schedule</h3>
                <pre>{JSON.stringify(schedule, null, 2)}</pre>
              </article>
            </div>
          </section>
        )}

        {page === 'login' && (
          <section className="panel narrow-panel">
            <h2>Login</h2>
            {/*
              STUDENT TASK:
              Redesign this form for usability and visual clarity.

              Do more than changing colors. Think about:
              - field labels and helper text
              - input spacing and alignment
              - keyboard focus visibility
              - accessible error messages
              - success and failure feedback
              - what a first-time visitor should do next

              You may add:
              - a "show password" control
              - remember-me behavior
              - a forgot-password placeholder flow
              - social proof or reassurance text
              - inline hints or validation
            */}
            <form onSubmit={handleLogin} className="form-stack">
              <label>
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </label>

              <button type="submit">Login</button>
            </form>
          </section>
        )}

        {page === 'register' && (
          <section className="panel narrow-panel">
            <h2>Register</h2>
            {/*
              STUDENT TASK:
              Improve the registration experience in a substantial way.

              This is a strong place to apply textbook principles:
              - Consistency across labels, buttons, and spacing
              - Error prevention and informative feedback
              - Easy reversal of actions
              - Clear sense of progress and closure
              - Reduced memory load through examples and defaults

              Creative options:
              - group fields into sections such as Personal Info and Race Info
              - use a two-step or wizard-style form
              - explain why emergency phone is needed
              - clarify that team name is optional
              - create better confirmation messaging after submit
              - add thoughtful microcopy that makes the form feel more humane
            */}
            <form onSubmit={handleRegister} className="form-stack">
              <label>
                Name
                <input
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </label>

              <label>
                Age
                <input
                  value={registerForm.age}
                  onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                />
              </label>

              <label>
                Emergency Phone
                <input
                  value={registerForm.emergencyPhone}
                  onChange={(e) => setRegisterForm({ ...registerForm, emergencyPhone: e.target.value })}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </label>

              <label>
                Team Name (optional)
                <input
                  value={registerForm.teamName}
                  onChange={(e) => setRegisterForm({ ...registerForm, teamName: e.target.value })}
                />
              </label>

              <button type="submit">Create Account</button>
            </form>
          </section>
        )}

        {page === 'dashboard' && (
          <section className="panel">
            <h2>Runner Dashboard</h2>
            {/*
              STUDENT TASK:
              Turn this raw dashboard into a truly useful private runner experience.

              You may redesign the content structure completely.
              For example, you could add:
              - a welcome area with the runner's name
              - a race-day checklist
              - a route/map panel
              - weather or arrival tips
              - teammate cards instead of raw JSON
              - a schedule timeline instead of plain text
              - stronger empty states when the user has no team

              Think about these textbook themes:
              - frequent users may benefit from shortcuts
              - informative feedback helps users feel in control
              - closure helps users understand what to do next
              - recognition is often better than recall
            */}
            <div className="card-grid">
              <article className="card">
                <h3>My Profile</h3>
                <pre>{JSON.stringify(profile, null, 2)}</pre>
              </article>

              <article className="card">
                <h3>My Teammates</h3>
                <pre>{JSON.stringify(teammates, null, 2)}</pre>
              </article>

              <article className="card wide-card">
                <h3>Race Schedule</h3>
                <pre>{JSON.stringify(schedule, null, 2)}</pre>
              </article>
            </div>
          </section>
        )}

        {page === 'admin' && (
          <section className="panel">
            <h2>Admin</h2>
            {/*
              STUDENT TASK:
              Replace this raw admin view with a better management interface.

              Design opportunities:
              - improve scanning with a real table or card-based admin layout
              - add sort, filter, or search
              - visually distinguish admins from non-admins
              - add safer action design such as confirmation dialogs
              - improve mobile behavior for large datasets
              - add status chips, badges, or row actions

              This page is a good place to think about expert users.
              Shneiderman discusses shortcuts for frequent users; consider ways an admin
              can complete repeated tasks quickly and with fewer errors.
            */}
            {!profile?.isAdmin ? (
              <p>You must be an admin to use this page.</p>
            ) : (
              <div className="card">
                <pre>{JSON.stringify(adminRunners, null, 2)}</pre>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
