/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "@components/NxComponents.css";

import { classes } from "@utils/misc";
import { HTMLProps, PropsWithChildren } from "react";

import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";



interface NxCardProps extends PropsWithChildren<Omit<HTMLProps<HTMLDivElement>, "size">> {
    variant?: "default" | "grand" | "warning" | "help" | "positive" | "danger" | "special";
    size?: "small" | "medium";
}

export function NxCard(props: NxCardProps) {
    props.variant ??= "default";
    props.size ??= "medium";
    return (
        <div {...props} className={classes(props.className, "nx-card", props.size !== "medium" && "nx-card-small", props.variant !== "default" && `nx-card-${props.variant}`)}>
            {props.children}
        </div>
    );
}



export function NxTitle(props: PropsWithChildren<HTMLProps<HTMLElement>>) {
    return (
        <Heading {...props} className={classes(props.className, "nx-title")}>{props.children}</Heading>
    );
}



interface NxTextProps extends PropsWithChildren<Omit<HTMLProps<HTMLElement>, "size">> {
    size?: "small" | "medium";
}

export function NxText(props: NxTextProps) {
    props.size ??= "medium";
    return (
        <Paragraph {...props} size={props.size === "medium" ? "md" : "sm"} className={classes(props.className, "nx-text", props.size === "small" && "nx-text-small")}>{props.children}</Paragraph>
    );
}
