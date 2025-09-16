"use client";

import * as React from "react";
import { ChevronDownIcon, CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DateTimePickerProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Select date",
    className,
    disabled = false,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    );
    const [timeValue, setTimeValue] = React.useState<string>(
        value ? new Date(value).toTimeString().slice(0, 5) : "10:00"
    );

    React.useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setTimeValue(date.toTimeString().slice(0, 5));
        } else {
            setSelectedDate(undefined);
            setTimeValue("10:00");
        }
    }, [value]);

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            const [hours, minutes] = timeValue.split(":");
            date.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(date.toISOString());
        } else {
            setSelectedDate(undefined);
            onChange?.(undefined);
        }
        setOpen(false);
    };

    const handleTimeChange = (time: string) => {
        setTimeValue(time);
        if (selectedDate) {
            const [hours, minutes] = time.split(":");
            const newDate = new Date(selectedDate);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(newDate.toISOString());
        }
    };

    const clearDateTime = () => {
        setSelectedDate(undefined);
        setTimeValue("10:00");
        onChange?.(undefined);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Popover open={open} onOpenChange={setOpen} modal={true}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date-picker"
                                disabled={disabled}
                                className="w-full justify-between font-normal"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? selectedDate.toLocaleDateString() : placeholder}
                                </div>
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                captionLayout="dropdown"
                                onSelect={handleDateSelect}
                                disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {selectedDate && (
                    <>
                        <div className="flex-none">
                            <Input
                                type="time"
                                id="time-picker"
                                value={timeValue}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleTimeChange(e.target.value);
                                }}
                                disabled={disabled}
                                className="bg-background w-32 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="flex-none">
                            <Button
                                variant="outline"
                                size={"icon"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearDateTime();
                                }}
                                disabled={disabled}
                                className=""
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
