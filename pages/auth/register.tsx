import { ChangeEvent, FormEvent, useState } from 'react'

import { getAuthStore } from '../../src/store/store'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, jwt, register } = getAuthStore()

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    register(email, password).catch(console.error)
  }

  return (
    <div className="RegisterPage">
      user is: {user && user.email}
      <br />
      jwt is: {jwt}
      <form onSubmitCapture={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onInput={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onInput={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Create user</button>
      </form>
    </div>
  )
}
