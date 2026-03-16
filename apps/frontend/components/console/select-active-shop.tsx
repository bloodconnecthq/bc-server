"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { Shop, useShopStore } from "@/stores/use-active-shop";
import clsx from "clsx";

export default function SelectShopModal() {
    const { userShops, activeShop, setActiveShop } = useShopStore();
    const [shopToSetActive, setShopToSetActive] = useState<Shop>(activeShop);

    return (
        <>
            <Modal>
                <Modal.Trigger className="group border border-gray-200 p-2 min-h-10 flex items-center gap-2 rounded-2xl bg-red-">
                    <div className="flex items-center gap-2">
                        <div className="flex relative size-10 bg-primary rounded-full shrink-0 items-center justify-center text-white">
                            {activeShop?.name[0] || "Ek"}
                            <div className="w-2 h-2 bg-secondary rounded-full absolute bottom-0 right-[10%]"></div>
                        </div>
                        <div className="flex flex-col gap-0.5 shrink-0">
                            <p className="text-sm text-black font-bold">{activeShop?.name}</p>
                            <p className="text-xs text-foreground">{activeShop?.category}</p>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <img src="/icons/dropdown-icon.svg" alt="Dropdown Icon" />
                    </div>
                </Modal.Trigger>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-90">
                            <Modal.Header>
                                <Modal.Heading>Changer de boutique</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-foreground">
                                    Changez de boutique et continuez à gérer vos produits et commandes
                                </p>
                                <div className="mt-4 space-y-2">
                                    {userShops.length > 0 ? (
                                        userShops.map((s) => <>
                                            <div

                                                onClick={() => setShopToSetActive(s)}
                                                className={clsx(`group border cursor-pointer border-gray-200 p-2 min-h-10
                                                    flex items-center justify-between gap-2 rounded-2xl`, shopToSetActive?.id === s.id && "border-primary")}>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex relative  size-10 bg-primary rounded-full shrink-0 items-center justify-center text-white">
                                                        {s?.name[0] || "Ek"}
                                                        {activeShop?.id === s.id && <div className="w-2 h-2 bg-secondary rounded-full absolute bottom-0 right-[10%]"></div>}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 shrink-0">
                                                        <p className="text-sm text-black font-bold">{s?.name}</p>
                                                        <p className="text-xs text-foreground">{s?.category}</p>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    <img src="/icons/dropdown-icon.svg" alt="Dropdown Icon" />
                                                </div>
                                            </div></>)
                                    ) : "Aucune store crée le"}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="justify-start">
                                <Button
                                    slot="close"
                                    onClick={() => setActiveShop(shopToSetActive)}
                                    className="rounded-xl w-full"
                                    variant="primary">
                                    Changer de boutique
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>

            </Modal>
        </>
    );
}