import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/customers/add-customer')({
  beforeLoad: () => {
    throw redirect({ to: '/customers' })
  },
  component: () => null,
})
