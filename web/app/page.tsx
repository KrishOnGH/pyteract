"use client"

export default function Home() {
  if (typeof window !== "undefined") {
    window.location.href = '/create'
  } else {
    return (
      <div className={`w-screen 'bg-[#0b0d11]' flex justify-center items-center h-screen`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    )
  }
}
