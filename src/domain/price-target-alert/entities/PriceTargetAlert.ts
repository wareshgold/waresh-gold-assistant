export interface PriceTargetAlertProps {
    id: string;
    userId: string;
    targetPrice: number;
    direction: "ABOVE" | "BELOW";
    active: boolean;
    createdAt: Date;
    notifiedAt: Date | null;
}

export class PriceTargetAlert {
    readonly id: string;
    readonly userId: string;
    readonly targetPrice: number;
    readonly direction: "ABOVE" | "BELOW";
    readonly active: boolean;
    readonly createdAt: Date;
    readonly notifiedAt: Date | null;

    constructor(props: PriceTargetAlertProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.targetPrice = props.targetPrice;
        this.direction = props.direction;
        this.active = props.active;
        this.createdAt = props.createdAt;
        this.notifiedAt = props.notifiedAt;
    }

    static create(
        userId: string,
        targetPrice: number,
        direction: "ABOVE" | "BELOW"
    ): PriceTargetAlert {
        return new PriceTargetAlert({
            id: `alert_${userId}_${Date.now()}`,
            userId,
            targetPrice,
            direction,
            active: true,
            createdAt: new Date(),
            notifiedAt: null
        });
    }

    shouldNotify(currentPrice: number): boolean {
        if (!this.active) return false;
        if (this.direction === "ABOVE") {
            return currentPrice >= this.targetPrice;
        }
        return currentPrice <= this.targetPrice;
    }

    markNotified(): PriceTargetAlert {
        return new PriceTargetAlert({
            ...this,
            active: false,
            notifiedAt: new Date()
        });
    }

    cancel(): PriceTargetAlert {
        return new PriceTargetAlert({
            ...this,
            active: false
        });
    }
}
