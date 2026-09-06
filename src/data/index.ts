import dashboardData from './dashboard.json'
import transactionsData from './transactions.json'
import categoriesData from './categories.json'
import invoicesData from './invoices.json'
import customersData from './customers.json'
import itemsData from './items.json'
import notificationsData from './notifications.json'
import aiProvidersData from './ai-providers.json'
import teamsData from './teams.json'

export {
  dashboardData,
  transactionsData,
  categoriesData,
  invoicesData,
  customersData,
  itemsData,
  notificationsData,
  aiProvidersData,
  teamsData,
}

export const initialTransactions = transactionsData
export const initialCustomers = customersData
export const initialItems = itemsData
export const initialInvoices = invoicesData.invoices
export const initialInvoiceDetails = invoicesData.invoiceDetails
export const initialNotifications = notificationsData
export const initialAiProviders = aiProvidersData
export const initialCategories = categoriesData
export const initialTeams = teamsData.teams
export const initialCurrentUser = teamsData.currentUser
