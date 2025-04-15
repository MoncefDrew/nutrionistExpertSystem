"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { User } from "lucide-react"

export function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("/api/client/feedback")
        console.log(response)
        setFeedbacks(response.data)
      } catch (err) {
        console.error("Failed to fetch feedbacks", err)
      }
    }

    fetchFeedbacks()
  }, [])

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Success Stories</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              See how our platform has helped people achieve their nutrition and health goals.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          {feedbacks.length > 0 ? (
            feedbacks.map((f) => (
              <div key={f.id} className="rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-200 rounded-full p-3">
                    <User className="text-gray-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 italic">``{f.message}``</p>
                    <p className="mt-2 font-semibold">{f.username ?? "Anonymous"}</p>
                    <p className="text-yellow-500">{`⭐`.repeat(f.rating)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No feedback available yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
