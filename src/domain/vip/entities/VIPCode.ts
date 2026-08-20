import {
    VIPFeature
} from "../VIPFeature";

export interface VIPCodeProps {
    id: string;
    code: string;
    feature: VIPFeature;
    expiresAt: Date | null;
    createdAt: Date;
    redeemedBy?: string | null;
    redeemedAt?: Date | null;
}

export class VIPCode {

    readonly id: string;
    readonly code: string;
    readonly feature: VIPFeature;
    readonly expiresAt: Date | null;
    readonly createdAt: Date;
    readonly redeemedBy: string | null;
    readonly redeemedAt: Date | null;

    private constructor(
        props: VIPCodeProps
    ) {
        this.id = props.id;
        this.code = props.code.trim().toUpperCase();
        this.feature = props.feature;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt;
        this.redeemedBy = props.redeemedBy ?? null;
        this.redeemedAt = props.redeemedAt ?? null;
    }

    static create(
        props: VIPCodeProps
    ): VIPCode {
        if (!props.code.trim()) {
            throw new Error("VIP code is required");
        }

        if (!props.id.trim()) {
            throw new Error("VIP code id is required");
        }

        if (
            props.redeemedBy !== null &&
            props.redeemedBy !== undefined &&
            !props.redeemedBy.trim()
        ) {
            throw new Error("VIP code redeemedBy is invalid");
        }

        return new VIPCode(props);
    }

    isExpired(
        now: Date = new Date()
    ): boolean {
        if (!this.expiresAt) {
            return false;
        }

        return this.expiresAt.getTime() <= now.getTime();
    }

    isUsed(): boolean {
        return this.redeemedBy !== null;
    }

    canActivate(
        now: Date = new Date()
    ): boolean {
        return !this.isExpired(now) && !this.isUsed();
    }
}
