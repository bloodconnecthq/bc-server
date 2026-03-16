"use client";

import { useEffect, useState } from "react";

type TypingHeaderProps = {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delay?: number;
};

export default function TypingHeader({
    words,
    typingSpeed = 100,
    deletingSpeed = 50,
    delay = 1500,
}: TypingHeaderProps) {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!words.length) return;

        const currentWord = words[index];

        let timeout: NodeJS.Timeout;

        if (!isDeleting && text === currentWord) {
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, delay);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
        } else {
            timeout = setTimeout(() => {
                setText((prev) =>
                    isDeleting
                        ? currentWord.slice(0, prev.length - 1)
                        : currentWord.slice(0, prev.length + 1)
                );
            }, isDeleting ? deletingSpeed : typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, index, words, typingSpeed, deletingSpeed, delay]);

    return (
        <span className="inline-flex items-center">
            {text}
            <span className="ml-1 w-0.5 h-[1.2em] bg-white animate-blink" />
        </span>
    );
}
