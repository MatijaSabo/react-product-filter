"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const value = (props.value || props.defaultValue) as number[];
  const [from, to] = value;

  return (
    <div className="w-full max-w-sm mx-auto py-8">
      <div className="w-full flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{props.min}</span>

        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          {(props.value ?? props.defaultValue)?.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <Badge className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-4">
                {index === 0 ? from : to}
              </Badge>
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Root>

        <span className="text-sm text-muted-foreground">{props.max}</span>
      </div>
    </div>
  );
});

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
