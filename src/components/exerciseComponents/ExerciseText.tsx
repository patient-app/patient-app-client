export default function ExerciseText({
                                         elementId,
                                         description,
                                     }: Readonly<{
    elementId: string;
    description: { text: string };
}>) {
    return (
        <div className="my-4 w-full">
            <p className="text-lg text-gray-700">
                {description.text}
            </p>
        </div>
    );
};