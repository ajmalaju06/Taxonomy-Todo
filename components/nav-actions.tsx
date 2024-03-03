"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"

const NavActions = () => {
  const authToken = localStorage.getItem("authToken")
  const path = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.setItem("authToken", "")
    router.replace("/")
  }

  return (
    <div className="flex gap-4">
      {authToken ? (
        path === "/todo" ? (
          <Button
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4 gap-3"
            )}
            onClick={() => handleLogout()}
          >
            <svg
              height="auto"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              version="1.1"
              viewBox="0 0 32 32"
              className="rotate-180"
              color="white"
            >
              <path
                d="M18,21.999l0,2.001c0,0.796 -0.316,1.559 -0.879,2.121c-0.562,0.563 -1.325,0.879 -2.121,0.879c-2.166,0 -4.834,0 -7,0c-0.796,0 -1.559,-0.316 -2.121,-0.879c-0.563,-0.562 -0.879,-1.325 -0.879,-2.121l-0,-16c-0,-0.796 0.316,-1.559 0.879,-2.121c0.562,-0.563 1.325,-0.879 2.121,-0.879c2.166,0 4.834,-0 7,0c1.657,-0 3,1.343 3,3c-0,0 -0,1.941 -0,1.941c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l-0,-1.941c-0,-2.761 -2.239,-5 -5,-5c-2.166,-0 -4.834,0 -7,-0c-1.326,-0 -2.598,0.527 -3.536,1.464c-0.937,0.938 -1.464,2.21 -1.464,3.536c-0,4.439 -0,11.561 0,16c-0,1.326 0.527,2.598 1.464,3.536c0.938,0.937 2.21,1.464 3.536,1.464c2.166,-0 4.834,-0 7,0c1.326,0 2.598,-0.527 3.536,-1.464c0.937,-0.938 1.464,-2.21 1.464,-3.536c0,-1.102 0,-2.001 0,-2.001c0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1Z"
                fill="currentColor"
              />
              <path
                d="M26.436,15l-17.21,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1l17.245,0l-3.967,3.967c-0.391,0.391 -0.391,1.024 -0,1.415c0.39,0.39 1.024,0.39 1.414,-0c-0,-0 2.567,-2.567 4.243,-4.243c1.171,-1.172 1.171,-3.071 -0,-4.243l-4.243,-4.242c-0.39,-0.391 -1.024,-0.391 -1.414,-0c-0.391,0.39 -0.391,1.024 -0,1.414l3.932,3.932Z"
                fill="currentColor"
              />
            </svg>
            Logout
          </Button>
        ) : (
          <nav>
            <Link
              href="/todo"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Go to Todo List
            </Link>
          </nav>
        )
      ) : (
        <nav>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4"
            )}
          >
            Login
          </Link>
        </nav>
      )}
    </div>
  )
}

export default NavActions
