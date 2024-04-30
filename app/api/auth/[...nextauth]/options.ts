import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your Username" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials) {
                //TODO : Retrieve user data from database
                //DOCS : https://next-auth.js.org/configuration/providers/credentials
                const user = { id: '1', name: "John Doe", password: "auth123" }

                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                }
                else
                    return null
            }
        })
    ]
}