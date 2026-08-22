export interface SwingLeg {
    startIndex: number;
    endIndex: number;
    startPrice: number;
    endPrice: number;
}

export interface TwoLeg {
    leg1: SwingLeg;
    leg2: SwingLeg;
    retracementPercent: number;
    completionPrice: number;
    completionIndex: number;
}