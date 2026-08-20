import {
    VIPFeature
} from "../VIPFeature";

export interface VIPCodeProps {
    id: string;
    code: string;
    feature: VIPFeature;
    maxUsers: number;
    usedCount: number;
    expiresAt: Date | null;
    createdAt: Date;
}

export class VIPCode {

    readonly id: string;
    readonly code: string;
    readonly feature: VIPFeature;
    readonly maxUsers: number;
    readonly usedCount: number;
    readonly expiresAt: Date | null;
    readonly createdAt: Date;

    private constructor(
        props: VIPCodeProps
    ) {
        this.id = props.id;
        this.code = props.code;
        this.feature = props.feature;
        this.maxUsers = props.maxUsers;
        this.usedCount = props.usedCount;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt;
    }

    static create(
        props: VIPCodeProps
    ): VIPCode {
        if (!props.code.trim()) {
            throw new Error("VIP code is required");
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

    hasCapacity(): boolean {
        return this.usedCount < this.maxUsers;
    }

    canActivate(
        now: Date = new Date()
    ): boolean {
        return (
            !this.isExpired(now) &&
            this.hasCapacity()
        );
    }
}