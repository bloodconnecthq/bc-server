"use client";

import { useState, useRef } from "react";
import {
    Button,
    Input,
    Label,
    ListBox,
    Select,
    Form,
    TextField,
    ColorSwatchPicker,
    ColorField,
    ColorInputGroup,
    parseColor,ColorArea, ColorPicker, ColorSlider, ColorSwatch
} from "@heroui/react";

import XedoBusinessIcon from "@/components/shared/xedo-business-icon";
import StepIndicator from "@/components/shared/step-indicator";
import { ACTIVITY_CATEGORIES, BRAND_COLORS, CURRENCIES } from "@/config/constant";

export default function GetStarted() {
    const [currentStep, setCurrentStep] = useState(1);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(parseColor("#2D9E47"));
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const shuffleColor = () => {
        const randomHue = Math.floor(Math.random() * 360);
        const randomSaturation = 50 + Math.floor(Math.random() * 50);
        const randomLightness = 40 + Math.floor(Math.random() * 30);
        setSelectedColor(parseColor(`hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                setLogoPreview(URL.createObjectURL(file));
            } else {
                alert("Veillez sélectionner une image.");
            }
        }
    };

    const handleNext = () => {
        setCurrentStep(2);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const inputClass =
        "w-full focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!";

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <XedoBusinessIcon className="mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Parlez-nous de votre chère entreprise
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Construisons ensemble votre vitrine numérique parfaite.
                </p>

                <StepIndicator currentStep={currentStep} />

                <Form className="flex flex-col gap-5">
                    { }
                    {currentStep === 1 && (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-gray-700">
                                    Logo de la marque <span className="text-red-500">*</span>
                                </Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="h-20 w-auto object-contain rounded"
                                        />
                                    ) : (
                                        <Button
                                            onClick={handleClick}
                                            variant="outline"
                                            className="rounded-[10px] focus:ring-0 focus:border-r-0 ring-0 text-foreground outline-0"
                                        >
                                            Choisir une image
                                        </Button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <TextField isRequired className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">Nom de la boutique</Label>
                                    <Input placeholder="" className={inputClass} />
                                </TextField>

                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Catégorie d'activité <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        className="w-full focus:outline-none! ring-0 border-0 focus:border-none focus:ring-0 border-transparent shadow-none!"
                                        placeholder="Sélectionner"
                                    >
                                        <Select.Trigger className="w-full border data-[hovered=true]:bg-gray-50 shadow-none border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex items-center justify-between outline-none focus:ring-[1px] focus:ring-primary">
                                            <Select.Value className="text-sm text-gray-700" />
                                            <Select.Indicator className="text-gray-400" />
                                        </Select.Trigger>
                                        <Select.Popover className="bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                                            <ListBox>
                                                {ACTIVITY_CATEGORIES.map((cat) => (
                                                    <ListBox.Item
                                                        key={cat}
                                                        id={cat}
                                                        textValue={cat}
                                                        className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        {cat}
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium text-gray-700">Couleur de votre marque</Label>
                                <div className="flex items-center gap-2">
                                    <ColorSwatchPicker>
                                        {BRAND_COLORS.map((color) => (
                                            <ColorSwatchPicker.Item key={color} color={color}>
                                                <ColorSwatchPicker.Swatch />
                                                <ColorSwatchPicker.Indicator />
                                            </ColorSwatchPicker.Item>
                                        ))}
                                    </ColorSwatchPicker>

                                    <ColorPicker value={selectedColor} onChange={setSelectedColor}>
                                        <ColorPicker.Trigger aria-label="Color field">
                                            <button
                                                type="button"
                                                className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
                                                title="Couleur personnalisée"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="text-gray-500"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        </ColorPicker.Trigger>
                                        <ColorPicker.Popover className="gap-2">
                                            <ColorSwatchPicker className="justify-center pt-2" size="xs">
                                                {BRAND_COLORS.map((preset) => (
                                                    <ColorSwatchPicker.Item key={preset} color={preset}>
                                                        <ColorSwatchPicker.Swatch />
                                                    </ColorSwatchPicker.Item>
                                                ))}
                                            </ColorSwatchPicker>
                                            <ColorArea
                                                aria-label="Color area"
                                                className="max-w-full"
                                                colorSpace="hsb"
                                                xChannel="saturation"
                                                yChannel="brightness"
                                            >
                                                <ColorArea.Thumb />
                                            </ColorArea>
                                            <div className="flex items-center gap-2 px-1">
                                                <ColorSlider aria-label="Hue slider" channel="hue" className="flex-1" colorSpace="hsb">
                                                    <ColorSlider.Track>
                                                        <ColorSlider.Thumb />
                                                    </ColorSlider.Track>
                                                </ColorSlider>
                                                <Button
                                                    isIconOnly
                                                    aria-label="Shuffle color"
                                                    size="sm"
                                                    variant="tertiary"
                                                    onPress={shuffleColor}
                                                >
                                                    <p className="size-4">Random</p>
                                                </Button>
                                            </div>
                                            <ColorField aria-label="Color field">
                                                <ColorInputGroup variant="secondary">
                                                    <ColorInputGroup.Prefix>
                                                        <ColorSwatch size="xs" />
                                                    </ColorInputGroup.Prefix>
                                                    <ColorInputGroup.Input />
                                                </ColorInputGroup>
                                            </ColorField>
                                        </ColorPicker.Popover>
                                    </ColorPicker>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onPress={handleNext}
                                variant="primary"
                                className="w-full py-3 rounded-xl mt-2"
                            >
                                Continuer
                            </Button>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-gray-700">Biographie</Label>
                                <textarea
                                    rows={4}
                                    placeholder=""
                                    className="focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none! rounded-md resize-none transition w-full"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <TextField isRequired className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">Email professionnel</Label>
                                    <Input type="email" className={inputClass} />
                                </TextField>

                                <TextField isRequired className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                                    <Input className={inputClass} />
                                </TextField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <TextField isRequired className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">Pays de résidence</Label>
                                    <Input className={inputClass} />
                                </TextField>

                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Devise <span className="text-red-500">*</span>
                                    </Label>
                                    <Select defaultValue="XOF" className="w-full">
                                        <Select.Trigger className="w-full data-[hovered=true]:bg-gray-50 border shadow-none border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex items-center justify-between outline-none focus:ring-[1px] focus:ring-primary">
                                            <Select.Value className="text-sm text-gray-700" />
                                            <Select.Indicator className="text-gray-400" />
                                        </Select.Trigger>
                                        <Select.Popover className="bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                                            <ListBox>
                                                {CURRENCIES.map((currency) => (
                                                    <ListBox.Item
                                                        key={currency}
                                                        id={currency}
                                                        textValue={currency}
                                                        className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        {currency}
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Button
                                    type="button"
                                    onPress={handleBack}
                                    variant="outline"
                                    className="w-full border border-gray-200 text-gray-
                                     font-semibold py-3 rounded-xl transition-colors hover:bg-gray-50"
                                >
                                    Retour
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full text-white font-semibold py-3 rounded-xl transition-colors"
                                >
                                    Continuer
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}