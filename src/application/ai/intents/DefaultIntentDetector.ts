import { AIMessage } from "../client/AIMessage";
import { AICompletionResult } from "../client/AICompletionResult";

export type IntentName =
    | "tool_call"
    | "domain_action"
    | "casual_chat"
    | "system"
    | "unknown";

export interface Intent {
    name: IntentName;
    confidence: number;
    toolName?: string;
    domainAction?: string;
}

export class DefaultIntentDetector {

    detect(
        userMessage: AIMessage,
        completion: AICompletionResult,
        context: AIMessage[]
    ): Intent {

        // 1) اگر مدل Tool Call داده
        if (completion.toolCalls && completion.toolCalls.length > 0) {
            return {
                name: "tool_call",
                confidence: 0.95,
                toolName: completion.toolCalls[0].name
            };
        }

        const text = (userMessage.content || "").toLowerCase();

        // 2) Intentهای دامنه‌ای
        if (this.isDomainAction(text)) {
            return {
                name: "domain_action",
                confidence: 0.9,
                domainAction: this.extractDomainAction(text)
            };
        }

        // 3) Intentهای سیستمی
        if (this.isSystemIntent(text)) {
            return {
                name: "system",
                confidence: 0.8
            };
        }

        // 4) چت معمولی
        if (this.isCasual(text)) {
            return {
                name: "casual_chat",
                confidence: 0.7
            };
        }

        // 5) ناشناخته
        return {
            name: "unknown",
            confidence: 0.3
        };
    }

    private isDomainAction(text: string): boolean {
        return [
            "price",
            "bubble",
            "market",
            "invoice",
            "order",
            "signal"
        ].some(k => text.includes(k));
    }

    private extractDomainAction(text: string): string {
        if (text.includes("price")) return "get_price";
        if (text.includes("bubble")) return "calculate_bubble";
        if (text.includes("invoice")) return "create_invoice";
        return "generic_domain_action";
    }

    private isSystemIntent(text: string): boolean {
        return [
            "help",
            "راهنما",
            "تنظیمات",
            "config",
            "setting"
        ].some(k => text.includes(k));
    }

    private isCasual(text: string): boolean {
        return [
            "سلام",
            "چطوری",
            "حالت چطوره",
            "شوخی",
            "گپ",
            "chat"
        ].some(k => text.includes(k));
    }
}
