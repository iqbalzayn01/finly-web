import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/customers/add-customer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/customers/add-customer"!</div>
}
