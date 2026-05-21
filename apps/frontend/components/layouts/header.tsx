import { Button, InputGroup, Kbd } from "@heroui/react";
import { HamburgerMenu, Notification, SearchNormal1 } from "iconsax-reactjs";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-3">
                <Button variant="ghost"
                    className="lg:hidden rounded-xl bg-white p-0 hover:bg-none"
                    onClick={onMenuClick}>
                    <HamburgerMenu size={24} />
                </Button>

                <InputGroup className="border-0 focus:border-0 hidden lg:flex shadow-none outline-0">
                    <InputGroup.Prefix>
                        <SearchNormal1 className="size-4 text-muted" />
                    </InputGroup.Prefix>
                    <InputGroup.Input className="w-full max-w-80 truncate outline-0 focus:border-0 focus:ring-0 border-0 ring-0"
                        placeholder="Rechercher n'importe quoi" />
                </InputGroup>

                <div className="hidden lg:flex items-center gap-2">
                    <Kbd className="bg-gray-100">
                        <Kbd.Abbr keyValue="command" />
                    </Kbd>
                    <Kbd className="bg-gray-100">
                        <Kbd.Content>K</Kbd.Content>
                    </Kbd>
                </div>
            </div>


            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    className="rounded-xl hover:bg-gray-100">
                    Boutique active
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </Button>

                <Button isIconOnly
                    className="rounded-xl lg:hidden bg-white hover:bg-gray-100 border-2 border-gray-100"
                    variant="tertiary">
                    <SearchNormal1 />
                </Button>

                <div className="hidden lg:flex items-center gap-4">
                    <Button isIconOnly
                        className="rounded-xl bg-white hover:bg-gray-100 border-2 border-gray-100"
                        variant="tertiary">
                        <Notification />
                    </Button>
                    <Button isIconOnly
                        className="rounded-xl bg-white hover:bg-gray-100 border-2 border-gray-100"
                        variant="tertiary">
                        <Notification />
                    </Button>
                </div>
                <Button
                    className="rounded-xl"
                    variant="primary">
                    Voir le catalogue
                </Button>

                <Button className="w-9 h-9 rounded-full bg-[#ED823A]" />
            </div>
        </header>
    );
}