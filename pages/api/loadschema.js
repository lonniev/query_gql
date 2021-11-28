import {gql} from "graphql-tag"

export const typeDefs = 
gql`
scalar URL
scalar EmailAddress
scalar PositiveFloat

type Industry {
  name: String!
  description: String
  companies: [Company] @relationship( type: "Member", direction: IN )
}

type Company {
  name: String!
  description: String
  url: URL

  industries: [Industry] @relationship( type: "Member", direction: OUT )
  locations: [GeographicRegion] @relationship(type: "HasLocation", direction: OUT)
  staffedRoles: [EmploysInRole]  @relationship(type: "HasStaffedRole", direction: OUT)
  vendorOf: [Repository] @relationship(type: "VendorOf", direction: OUT)
}

type GeographicRegion {
  name: String!
  description: String
}

type Role {
  name: String!
  description: String

  where: [EmploysInRole] @relationship(type: "FilledRole", direction: IN)
  who: [Person] @relationship(type: "HasRole", direction: IN)
}

type Person {
  name: String!
  description: String
  email: EmailAddress
  notes: String

  worksIn: [GeographicRegion] @relationship(type: "WorksIn", direction: OUT)
  knows: [Person] @relationship(type: "Knows", direction: OUT)
  fillsRole: [EmploysInRole] @relationship(type: "FillsRole", direction: IN)
  considers: [Product] @relationship(type: "Considering", direction: OUT)
}

type EmploysInRole {
  name: String!
  description: String

  company: Company @relationship(type: "Has", direction: IN)
  role: Role! @relationship(type: "FilledRole", direction: IN)
}

type WebPage {
  name: String!
  description: String
  retrieved: DateTime
  published: DateTime
  url: URL

  relevantTo: [Person] @relationship(type: "Relevant", direction: OUT)
}

type UseCase {
  name: String!
  description: String

  soughtBy: [Person] @relationship(type: "SoughtBy", direction: OUT)
  involves: [Repository] @relationship(type: "Involves", direction: OUT)
}

type Repository {
  name: String!
  description: String
}

type Product {
  name: String!
  description: String

  tutorials: [Tutorial] @relationship(type: "Tutorial", direction: OUT)
  connectors: [Connector] @relationship(type: "HasConnector", direction: OUT)
}

type Tutorial {
  name: String!
  description: String

  products: [Product] @relationship(type: "Tutorial", direction: IN)
}

type Binding {
  name: String!
  description: String
  notes: String
  probability: PositiveFloat

  releases: [Release] @relationship(type: "HasRelease", direction: OUT)
  commits: [Connector] @relationship(type: "CommitsConnector", direction: OUT)
}

type Feature {
  name: String!
  description: String

  exhibits: [Feature] @relationship(type: "BindingExhibits", direction: OUT)
}

type Release {
  name: String!
  description: String
}

type Epic {
  name: String!
  description: String
  jiraId: String
}

type Connector {
  name: String!
  description: String

  offersCRUD: [Repository] @relationship(type: "OffersCRUD", direction: OUT)
  realizes: [Connector] @relationship(type: "RealizesEpic", direction: OUT)
}
`