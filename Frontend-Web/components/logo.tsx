import Image from "next/image";

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className = "", size = 40 }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ml-2 mt-3 ${className}`}>
            <div className="relative">
                <Image
                    src="/rave-logo.svg"
                    alt="Rave Logo"
                    width={size}
                    height={size}
                    className="brightness-0 invert"
                />
            </div>
            <span className="text-xl font-bold text-white">Rave</span>
        </div>
    );
}
