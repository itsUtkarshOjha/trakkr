type Props = {
  heading: string;
  subheading?: string;
};

export default function HeadingSubheading({ heading, subheading }: Props) {
  return (
    <div>
      <h1 className="mt-6 lg:mt-12 text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4">
        {heading}
      </h1>
      {subheading && (
        <h4 className="my-4 text-muted-foreground text-sm lg:text-base">
          {subheading}
        </h4>
      )}
    </div>
  );
}
