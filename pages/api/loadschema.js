import {gql} from "graphql-tag"

export const typeDefs = 
gql`
scalar URL
scalar EmailAddress
scalar PositiveFloat

type SyndeiaQuery {
  title: String!
  intent: String
  expression: String

  created: DateTime @timestamp(operations: [CREATE])
  updated: DateTime @timestamp(operations: [CREATE, UPDATE])

  createdByRole: [EmploysInRole] @relationship(type: "CreatedByRole", direction: OUT)
  curatedBy: [Person]  @relationship(type: "CuratedBy", direction: OUT)
  sharedWith: [Person] @relationship(type: "SharedWith", direction: OUT)

  disciplines: [Discipline] @relationship(type: "Concerns", direction: OUT)

  authors: [Person]
    @cypher( statement: "MATCH (this)-[:CreatedByRole]->(e:EmploysInRole)-[:FillsRole]->(p:Person) return distinct p"
    )
}

type Company {
  name: String!
  description: String
  url: URL

  staffedRoles: [EmploysInRole] @relationship(type: "HasStaffedRole", direction: OUT)
}

type EmploysInRole {
  name: String!
  description: String

  company: Company! @relationship(type: "HasStaffedRole", direction: IN)
  role: Role! @relationship(type: "FilledRole", direction: OUT)
  person: Person! @relationship(type: "FillsRole", direction: OUT)

  queryCreations: [SyndeiaQuery] @relationship(type: "CreatedByRole", direction: IN)
}

type Role {
  name: String!
  description: String

  instances: [EmploysInRole] @relationship(type: "FilledRole", direction: IN)
  holders: [Person] @relationship(type: "HasRole", direction: IN)
}

type Discipline {
  name: String!
  description: String
}

type Person {
  name: String!
  description: String
  email: EmailAddress
  notes: String

  fillsRole: [EmploysInRole] @relationship(type: "FillsRole", direction: OUT)
  knows: [Person] @relationship(type: "Knows", direction: OUT)

  queries: Int
    @cypher( statement: "MATCH (q:SyndeiaQuery)-[:CreatedByRole]->(eir:EmploysInRole)-[:FillsRole]->(this) return count(q)"
    )
}
`