/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./QuickAction.css";

import { InfoIcon } from "@components/Icons";
import { NxCard, NxText, NxTitle } from "@components/NxComponents";
import { openInviteModal } from "@utils/discord";
import { classes } from "@utils/misc";
import { closeAllModals } from "@utils/modal";
import { findByPropsLazy } from "@webpack";
import { Alerts, Button, FluxDispatcher, GuildStore, NavigationRouter } from "@webpack/common";
import { classNameFactory } from "@utils/css";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";

const cl = classNameFactory("vc-settings-quickActions-");
const ButtonClasses = findByPropsLazy("button", "disabled", "enabled");

export interface QuickActionProps {
    Icon: ComponentType<{ className?: string; }>;
    text: ReactNode;
    action?: () => void;
    disabled?: boolean;
}
interface QuickActionContainerProps {
    title: string;
    columns?: "2" | "3";
}

export function QuickAction(props: QuickActionProps) {
    const { Icon, action, text, disabled } = props;

    return (
        <Button look={Button.Looks.FILLED} color={Button.Colors.PRIMARY} onClick={action} disabled={disabled}>
            <div className={cl("button")}>
                <Icon className={cl("img")} />
                {text}
            </div>
        </Button>
    );
}

export function QuickActionContainer({ title, children, columns = "3" }: PropsWithChildren<QuickActionContainerProps>) {
    return (
        <NxCard className={cl("container")}>
            <NxTitle className={cl("title")}>
                {title}
                <button
                    role="switch"
                    onClick={() => {
                        Alerts.show({
                            title: "Information",
                            body: (
                                <>
                                    <div className={cl("help")}>
                                        <img height="64px" width="64px" src="https://cdn.discordapp.com/emojis/1348781960453161011.gif" draggable="false"></img>
                                        <p>No one's around to help.</p>
                                    </div>
                                    <NxCard variant="help">
                                        <NxText>If you're looking for actual help, please go ask in our Discord server (not Vencord's)! We'll always be there to help you out.</NxText>
                                    </NxCard>
                                </>
                            ),
                            cancelText: "(≧∀≦)ゞ",
                            confirmText: "Join our Server",
                            onConfirm: async () => {
                                if (!GuildStore.getGuild("1297010632591278090")) {
                                    const inviteAccepted = await openInviteModal("VS2wePpjnt");
                                    if (inviteAccepted) {
                                        closeAllModals();
                                        FluxDispatcher.dispatch({ type: "LAYER_POP_ALL" });
                                    }
                                } else {
                                    FluxDispatcher.dispatch({ type: "LAYER_POP_ALL" });
                                    NavigationRouter.transitionToGuild("1297010632591278090");
                                }
                            }
                        });
                    }}
                    className={classes(ButtonClasses.button, cl("info-button"))}
                >
                    <InfoIcon />
                </button>
            </NxTitle>
            <span className={cl(`containerButtons-${columns}`)}>{children}</span>
        </NxCard>
    );
}
