import Image from 'next/image';

interface AvatarSelectorProps {
    selectedAvatar: string | null;
    onSelect: (avatar: string) => void;
}

const AvatarSelector = ({ selectedAvatar, onSelect }: AvatarSelectorProps) => {
    const avatars = ['animalistic', 'blob', 'crystal', 'humanistic', 'plant', 'robotic', 'neuralnetwork', 'none'];
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
            {avatars.map((avatar) => (
                <div
                    key={avatar}
                    onClick={() => onSelect(avatar)}
                    className={`p-2 rounded-lg transition-all border-2 ${
                        selectedAvatar === avatar
                            ? 'bg-emerald-100 border-emerald-600 hover:border-emerald-600 cursor-auto'
                            : 'bg-white border-gray-200 hover:border-emerald-300 cursor-pointer'
                    }`}
                >
                    <Image
                        src={`${basePath}/avatars/${avatar}.png`}
                        alt={`${avatar} avatar`}
                        width={80}
                        height={80}
                        className="object-contain rounded-lg mx-auto"
                    />
                </div>
            ))}
        </div>
    );
};

export default AvatarSelector;