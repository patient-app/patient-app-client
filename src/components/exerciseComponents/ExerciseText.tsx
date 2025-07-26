export default function ExerciseText({
                                         description,
                                     }: Readonly<{
    description: { text: string };
}>) {
    return (
        <div className="my-4 w-full">
            <p className="text-lg">
                {description.text}
            </p>
        </div>
    );
};