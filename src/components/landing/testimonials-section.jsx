import Image from "next/image"

export function TestimonialsSection() {
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
          <div className="rounded-lg border p-6">
            <div className="flex items-start gap-4">
              <Image
                src="/avatars-000339084123-nag0p1-t1080x1080.jpg"
                alt="Client"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="text-gray-500 italic">
                  {`"The personalized nutrition plan helped me lose 20 pounds in 3 months. The expert guidance was
                  invaluable!"`}
                </p>
                <p className="mt-2 font-semibold">Sarah J.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <div className="flex items-start gap-4">
              <Image
                src="/63.jpg"
                alt="Client"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="text-gray-500 italic">
                  {`"As a nutritionist, this platform has made it so much easier to manage my clients and provide them
                  with personalized care."`}
                </p>
                <p className="mt-2 font-semibold">Dr. Michael T.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
