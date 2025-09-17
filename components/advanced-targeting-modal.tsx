"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Target, Globe, Smartphone, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Extended country list with properly encoded flags
const COUNTRIES = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "NO", name: "Norway", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "FI", name: "Finland", flag: "🇫🇮" },
    { code: "CH", name: "Switzerland", flag: "🇨🇭" },
    { code: "AT", name: "Austria", flag: "🇦🇹" },
    { code: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "IE", name: "Ireland", flag: "🇮🇪" },
    { code: "PL", name: "Poland", flag: "🇵🇱" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
    { code: "HU", name: "Hungary", flag: "🇭🇺" },
    { code: "GR", name: "Greece", flag: "🇬🇷" },
    { code: "RO", name: "Romania", flag: "🇷🇴" },
    { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
    { code: "HR", name: "Croatia", flag: "🇭🇷" },
    { code: "SK", name: "Slovakia", flag: "🇸🇰" },
    { code: "SI", name: "Slovenia", flag: "🇸🇮" },
    { code: "EE", name: "Estonia", flag: "🇪🇪" },
    { code: "LV", name: "Latvia", flag: "🇱🇻" },
    { code: "LT", name: "Lithuania", flag: "🇱🇹" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "KR", name: "South Korea", flag: "🇰🇷" },
    { code: "SG", name: "Singapore", flag: "🇸🇬" },
    { code: "MY", name: "Malaysia", flag: "🇲🇾" },
    { code: "TH", name: "Thailand", flag: "🇹🇭" },
    { code: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "PH", name: "Philippines", flag: "🇵🇭" },
    { code: "ID", name: "Indonesia", flag: "🇮🇩" },
    { code: "TW", name: "Taiwan", flag: "🇹🇼" },
    { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
    { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "EG", name: "Egypt", flag: "🇪🇬" },
    { code: "IL", name: "Israel", flag: "🇮🇱" },
    { code: "TR", name: "Turkey", flag: "🇹🇷" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "UA", name: "Ukraine", flag: "🇺🇦" },
    { code: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "CL", name: "Chile", flag: "🇨🇱" },
    { code: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "PE", name: "Peru", flag: "🇵🇪" },
    { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
    { code: "IS", name: "Iceland", flag: "🇮🇸" },
    { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
];

// Device/OS options with icons
const DEVICES = [
    { key: "windows", name: "Windows", icon: "🖥️" },
    { key: "macos", name: "macOS", icon: "🍎" },
    { key: "linux", name: "Linux", icon: "🐧" },
    { key: "android", name: "Android", icon: "🤖" },
    { key: "ios", name: "iOS", icon: "📱" },
];

interface GeoRule {
    countryCode: string;
    url: string;
}

interface DeviceRule {
    deviceKey: string;
    url: string;
}

interface AdvancedTargetingModalProps {
    geoTargeting?: Record<string, string>;
    deviceTargeting?: Record<string, string>;
    onSave: (data: {
        geoTargeting?: Record<string, string>;
        deviceTargeting?: Record<string, string>;
    }) => void;
}

export default function AdvancedTargetingModal({
    geoTargeting = {},
    deviceTargeting = {},
    onSave,
}: AdvancedTargetingModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Geo targeting state
    const [geoRules, setGeoRules] = useState<GeoRule[]>(
        Object.entries(geoTargeting).map(([code, url]) => ({
            countryCode: code,
            url,
        }))
    );
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [newGeoUrl, setNewGeoUrl] = useState<string>("");

    // Device targeting state
    const [deviceRules, setDeviceRules] = useState<DeviceRule[]>(
        Object.entries(deviceTargeting).map(([key, url]) => ({
            deviceKey: key,
            url,
        }))
    );

    const addGeoRule = () => {
        if (!selectedCountry || !newGeoUrl.trim()) return;
        if (geoRules.some((rule) => rule.countryCode === selectedCountry)) return;

        setGeoRules([
            ...geoRules,
            {
                countryCode: selectedCountry,
                url: newGeoUrl.trim(),
            },
        ]);
        setSelectedCountry("");
        setNewGeoUrl("");
    };

    const updateGeoRule = (index: number, url: string) => {
        const updated = [...geoRules];
        updated[index].url = url;
        setGeoRules(updated);
    };

    const updateDeviceRule = (index: number, url: string) => {
        const updated = [...deviceRules];
        updated[index].url = url;
        setDeviceRules(updated);
    };

    const removeGeoRule = (index: number) => {
        setGeoRules(geoRules.filter((_, i) => i !== index));
    };

    const removeDeviceRule = (index: number) => {
        setDeviceRules(deviceRules.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const geoData = geoRules
            .filter((rule) => rule.url.trim())
            .reduce(
                (acc, rule) => {
                    acc[rule.countryCode] = rule.url;
                    return acc;
                },
                {} as Record<string, string>
            );

        const deviceData = deviceRules
            .filter((rule) => rule.url.trim())
            .reduce(
                (acc, rule) => {
                    acc[rule.deviceKey] = rule.url;
                    return acc;
                },
                {} as Record<string, string>
            );

        onSave({
            geoTargeting: Object.keys(geoData).length > 0 ? geoData : undefined,
            deviceTargeting: Object.keys(deviceData).length > 0 ? deviceData : undefined,
        });

        setIsOpen(false);
    };

    const totalRules =
        geoRules.filter((r) => r.url.trim()).length +
        deviceRules.filter((r) => r.url.trim()).length;

    const getCountryInfo = (code: string) => COUNTRIES.find((c) => c.code === code);
    const getDeviceInfo = (key: string) => DEVICES.find((d) => d.key === key);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    className="flex w-full items-center justify-start gap-2"
                >
                    <Target size={16} />
                    <span className="flex-1 text-start">Advanced Targeting</span>
                    {totalRules > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {totalRules}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold">Targeting</DialogTitle>
                    <DialogDescription>
                        Redirect users to different URLs based on their location or device.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="geo" className="w-full">
                        <TabsList className="mb-6 grid w-full grid-cols-2">
                            <TabsTrigger value="geo" className="flex items-center gap-2">
                                <Globe size={16} />
                                Geo Targeting
                            </TabsTrigger>
                            <TabsTrigger value="device" className="flex items-center gap-2">
                                <Smartphone size={16} />
                                Device Targeting
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="geo" className="space-y-6">
                            {/* Existing Geo Rules */}
                            {geoRules.map((rule, index) => {
                                const country = getCountryInfo(rule.countryCode);
                                return (
                                    <div key={rule.countryCode} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-lg select-none"
                                                    style={{
                                                        fontFamily:
                                                            "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
                                                    }}
                                                >
                                                    {country?.flag || "🌍"}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {country?.name || rule.countryCode}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeGeoRule(index)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="https://example.com"
                                            value={rule.url}
                                            onChange={(e) => updateGeoRule(index, e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                );
                            })}

                            {/* Add New Geo Rule */}
                            <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={selectedCountry}
                                        onValueChange={setSelectedCountry}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Country" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {COUNTRIES.filter(
                                                (country) =>
                                                    !geoRules.some(
                                                        (rule) => rule.countryCode === country.code
                                                    )
                                            ).map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="select-none"
                                                            style={{
                                                                fontFamily:
                                                                    "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
                                                            }}
                                                        >
                                                            {country.flag}
                                                        </span>
                                                        <span>{country.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="https://example.com"
                                        value={newGeoUrl}
                                        onChange={(e) => setNewGeoUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                <Button
                                    onClick={addGeoRule}
                                    disabled={!selectedCountry || !newGeoUrl.trim()}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add location
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="device" className="space-y-6">
                            {/* iOS Targeting */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📱</span>
                                    <span className="text-sm font-medium">iOS Targeting</span>
                                </div>
                                <Input
                                    placeholder="https://apps.apple.com/app/1611158928"
                                    value={
                                        deviceRules.find((r) => r.deviceKey === "ios")?.url || ""
                                    }
                                    onChange={(e) => {
                                        const existingIndex = deviceRules.findIndex(
                                            (r) => r.deviceKey === "ios"
                                        );
                                        if (existingIndex >= 0) {
                                            updateDeviceRule(existingIndex, e.target.value);
                                        } else if (e.target.value.trim()) {
                                            setDeviceRules([
                                                ...deviceRules,
                                                { deviceKey: "ios", url: e.target.value.trim() },
                                            ]);
                                        }
                                    }}
                                    className="w-full"
                                />
                            </div>

                            {/* Android Targeting */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🤖</span>
                                    <span className="text-sm font-medium">Android Targeting</span>
                                </div>
                                <Input
                                    placeholder="https://play.google.com/store/apps/details?id=com.disney.disneyplus"
                                    value={
                                        deviceRules.find((r) => r.deviceKey === "android")?.url ||
                                        ""
                                    }
                                    onChange={(e) => {
                                        const existingIndex = deviceRules.findIndex(
                                            (r) => r.deviceKey === "android"
                                        );
                                        if (existingIndex >= 0) {
                                            updateDeviceRule(existingIndex, e.target.value);
                                        } else if (e.target.value.trim()) {
                                            setDeviceRules([
                                                ...deviceRules,
                                                {
                                                    deviceKey: "android",
                                                    url: e.target.value.trim(),
                                                },
                                            ]);
                                        }
                                    }}
                                    className="w-full"
                                />
                            </div>

                            {/* Other Device Rules */}
                            {deviceRules
                                .filter((rule) => !["ios", "android"].includes(rule.deviceKey))
                                .map((rule) => {
                                    const device = getDeviceInfo(rule.deviceKey);
                                    const actualIndex = deviceRules.findIndex(
                                        (r) => r.deviceKey === rule.deviceKey
                                    );
                                    return (
                                        <div key={rule.deviceKey} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{device?.icon}</span>
                                                    <span className="text-sm font-medium">
                                                        {device?.name} Targeting
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDeviceRule(actualIndex)}
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                            <Input
                                                placeholder="https://example.com"
                                                value={rule.url}
                                                onChange={(e) =>
                                                    updateDeviceRule(actualIndex, e.target.value)
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    );
                                })}
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
                        Add targeting
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
