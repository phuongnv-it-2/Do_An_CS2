export default function Example() {
  return (
    <section className="relative h-screen isolate overflow-hidden bg-[#00ebc7] px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-[#F2FFF7] shadow-xl ring-1 ring-[#00ebc7]/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <figure className="mt-10">
          <blockquote className="text-center text-xl leading-8 font-semibold text-[#00214d] sm:text-2xl sm:leading-9">
            "Chúng tôi đã làm việc với đội ngũ này trong hơn 2 năm và họ luôn
            mang đến những giải pháp vượt ngoài mong đợi. Sự chuyên nghiệp và
            sáng tạo của họ thực sự đáng kinh ngạc."
          </blockquote>
          <figcaption className="mt-10">
            <div className="flex items-center justify-center space-x-4">
              <img
                className="h-12 w-12 rounded-full border-2 border-[#00ebc7]"
                src="https://i.pravatar.cc/150?img=32"
                alt="Avatar"
              />
              <div className="text-left">
                <div className="font-semibold text-[#00214d]">Nguyễn Văn A</div>
                <div className="text-[#1b2d45]">CEO, TechCorp Vietnam</div>
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
