"use client";

import { HydrateProps, Hydrate as RQHydrate } from "react-query";

export function Hydrate(props: HydrateProps) {
    return <RQHydrate {...props} />;
}
