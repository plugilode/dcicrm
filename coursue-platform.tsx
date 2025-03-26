"use client"

import { useState } from "react"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Inbox,
  LogOut,
  MoreVertical,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CoursueApp() {
  const [activeTab, setActiveTab] = useState("Dashboard")

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#d8d8d8] p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-[#702dff] rounded-full p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 6V12C4 15.31 7.58 20 12 22C16.42 20 20 15.31 20 12V6L12 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-[#702dff] font-bold text-lg">COURSUE</span>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-[#5f5f5f] font-semibold text-xs mb-4">OVERVIEW</h3>
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: Home },
                { name: "Inbox", icon: Inbox },
                {
                  name: "Lesson",
                  icon: () => (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                        fill="currentColor"
                      />
                      <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: "Task",
                  icon: () => (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9 10.5L7 12.5L9 14.5L10.5 13L8.5 11L10.5 9L9 7.5L7 9.5L9 11.5L10.5 10L8.5 8L10.5 6L9 4.5L7 6.5L9 8.5L10.5 7L8.5 5L10.5 3L9 1.5L7 3.5L9 5.5Z"
                        fill="currentColor"
                      />
                      <path d="M14 10H17V12H14V10ZM14 14H17V16H14V14ZM14 6H17V8H14V6Z" fill="currentColor" />
                    </svg>
                  ),
                },
                { name: "Group", icon: Users },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center gap-3 w-full p-2 rounded-md ${
                    activeTab === item.name ? "text-[#702dff]" : "text-[#3f3f3f]"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[#5f5f5f] font-semibold text-xs mb-4">FRIENDS</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((id) => (
                <div key={id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Friend" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Prashant</p>
                    <p className="text-xs text-[#9e9e9e]">Software Developer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[#5f5f5f] font-semibold text-xs mb-4">SETTINGS</h3>
            <nav className="space-y-2">
              <button className="flex items-center gap-3 w-full p-2 rounded-md text-[#3f3f3f]">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-3 w-full p-2 rounded-md text-[#f13e3e]">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9e9e9e] h-5 w-5" />
            <Input placeholder="Search your course here..." className="pl-10 py-6 border-[#d8d8d8] rounded-lg" />
          </div>
          <Button variant="outline" className="ml-4 p-2 rounded-lg border-[#d8d8d8]">
            <Bell className="h-5 w-5 text-[#3f3f3f]" />
          </Button>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#702dff] to-[#962dff] rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-[#c893fd]"></div>
            <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-[#c893fd]"></div>
            <div className="absolute top-20 right-60 w-24 h-24 rounded-full bg-[#c893fd]"></div>
          </div>
          <div className="relative z-10">
            <p className="text-white text-sm mb-2">ONLINE COURSE</p>
            <h1 className="text-white text-3xl font-bold mb-6">
              Sharpen Your Skills With
              <br />
              Professional Online Courses
            </h1>
            <Button className="bg-[#202020] hover:bg-[#3f3f3f] text-white rounded-full px-6">
              Join Now
              <div className="ml-2 bg-white rounded-full p-1">
                <ChevronRight className="h-3 w-3 text-black" />
              </div>
            </Button>
          </div>
        </div>

        {/* Continue Watching */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Continue Watching</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-[#d8d8d8]">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-[#d8d8d8]">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <div key={id} className="bg-white rounded-xl border border-[#d8d8d8] overflow-hidden">
                <div className="relative">
                  <img
                    src={`/placeholder.svg?height=160&width=320`}
                    alt="Course thumbnail"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#f0e5fc] text-[#702dff] text-xs font-medium px-3 py-1 rounded-full">
                    FRONTEND
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-3">Beginner's Guide To Becoming A Professional Frontend Developer</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Instructor" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Prashant Kumar Singh</p>
                      <p className="text-xs text-[#9e9e9e]">Software Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Mentor Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Mentor</h2>
            <Button variant="link" className="text-[#702dff]">
              See All
            </Button>
          </div>

          <div className="border border-[#d8d8d8] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[#7e7e7e] text-xs border-b border-[#d8d8d8]">
                  <th className="text-left p-4 font-medium">INSTRUCTOR NAME & DATE</th>
                  <th className="text-left p-4 font-medium">COURSE TYPE</th>
                  <th className="text-left p-4 font-medium">COURSE TITLE</th>
                  <th className="text-left p-4 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Prashant Kumar Singh", date: "25/2/2023" },
                  { name: "Ravi Kumar", date: "25/2/2023" },
                ].map((instructor, idx) => (
                  <tr key={idx} className="border-b border-[#d8d8d8]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Instructor" />
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{instructor.name}</p>
                          <p className="text-xs text-[#9e9e9e]">{instructor.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#f0e5fc] text-[#702dff] text-xs font-medium px-3 py-1 rounded-full">
                        FRONTEND
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">Understanding Concept Of React</p>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" className="text-xs rounded-full bg-[#f0f0f0] border-none">
                        SHOW DETAILS
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 border-l border-[#d8d8d8] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">Your Profile</h2>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-t-[#702dff] border-r-[#702dff] border-b-transparent border-l-transparent rotate-45"></div>
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt="Profile" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="font-semibold text-lg">Good Morning Prashant</h3>
          <p className="text-sm text-center text-[#7e7e7e] mt-1">Continue Your Journey And Achieve Your Target</p>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Inbox className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Inbox className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-end justify-between h-32">
            {[40, 60, 80, 90, 95].map((height, idx) => (
              <div key={idx} className="w-8 bg-[#f0e5fc] rounded-t-md relative" style={{ height: `${height}%` }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#702dff] to-[#962dff]"
                  style={{ height: `${height * 0.7}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Mentor</h2>
            <Button variant="ghost" size="icon" className="rounded-full bg-[#f0e5fc] text-[#702dff]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((id) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Mentor" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Prashant Kumar Singh</p>
                    <p className="text-xs text-[#9e9e9e]">Software Developer</p>
                  </div>
                </div>
                <Button className="text-xs h-7 rounded-full bg-[#702dff] hover:bg-[#962dff] text-white">Follow</Button>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-[#f0e5fc] text-[#702dff] hover:bg-[#e0c6fd]">See All</Button>
        </div>
      </div>
    </div>
  )
}

