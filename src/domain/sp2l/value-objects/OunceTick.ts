export interface OunceTick {
    price: number;
    timestamp: number;
    direction?: "up" | "down" | "unknown";
    rawMessage?: string;
}