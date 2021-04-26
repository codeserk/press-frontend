import { ChangeEvent, FormEvent, useState } from 'react'

import { getAuthStore } from '../../src/store/store'

export default function RegisterPage() {
  const [email, setEmail] = useState('test10@test.com')
  const [password, setPassword] = useState('test')

  const { user, jwt, login } = getAuthStore()

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    login(email, password).catch(console.error)
  }

  return (
    <div className="LoginPage">
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
