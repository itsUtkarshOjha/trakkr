import { MetaFunction } from "@remix-run/node";
import HeadingSubheading from "~/components/heading-subheading";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | AI Chat" },
    {
      name: "AI Chat",
      content: "Fitness tips from AI chatbot.",
    },
  ];
};

export default function AIChat() {
  return (
    <div className="w-full h-[400px]">
      <HeadingSubheading
        heading="AI Chat"
        subheading="Get personalized fitness tips from AI."
      />
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg font-semibold opacity-50">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
}
