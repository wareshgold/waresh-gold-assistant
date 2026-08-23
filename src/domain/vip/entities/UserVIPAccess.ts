import {
    VIPFeature
} from "../VIPFeature";

export interface UserVIPAccessProps {
    id: string;
    telegramUserId: string;
    feature: VIPFeature;
    activatedAt: Date;
    expiresAt: Date | null;
}

export class UserVIPAccess {

    readonly id: string;
    readonly telegramUserId: string;
    readonly feature: VIPFeature;
    readonly activatedAt: Date;
    readonly expiresAt: Date | null;

    private constructor(
        props: UserVIPAccessProps
    ) {
        this.id = props.id;
        this.telegramUserId = props.telegramUserId;
        this.feature = props.feature;
        this.activatedAt = props.activatedAt;
        this.expiresAt = props.expiresAt;
    }

    static create(
        props: UserVIPAccessProps
    ): UserVIPAccess {
        return new UserVIPAccess(props);
    }

    isActive(
        now: Date = new Date()
    ): boolean {
        if (!this.expiresAt) {
            return true;
        }

        return this.expiresAt.getTime() > now.getTime();
    }
}