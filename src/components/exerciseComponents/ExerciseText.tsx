export default function ExerciseText({
                                         elementId,
                                         data,
                                     }: Readonly<{
    elementId: string;
    data: { text: string };
}>) {
    return (
        <div className="my-4 w-full">
            <p
                id={elementId}
                className="text-blue-figma"
                dangerouslySetInnerHTML={{__html: data.text}}
            />
        </div>
    );
};