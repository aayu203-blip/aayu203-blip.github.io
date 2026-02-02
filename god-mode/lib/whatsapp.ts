export const WHATSAPP_NUMBER = "919137151496"; // Updated Contact Number

interface WhatsAppLinkParams {
    text?: string;
    partNumber?: string;
    brand?: string;
    quantity?: number;
    source?: 'product_page' | 'bulk_paste' | 'cart';
    // Backwards compatibility / HeroSearch props
    type?: string;
    bulkId?: string;
    itemCount?: number;
}

export function generateWhatsAppLink(params: WhatsAppLinkParams): string {
    const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    let message = "";

    if (params.source === 'product_page' && params.partNumber) {
        message = `Hi, I need a quote for:\n\nPart: ${params.partNumber}\nBrand: ${params.brand || 'Any'}\nQty: ${params.quantity || 1}\n\nPlease verify stock and price.`;
    } else if ((params.source === 'bulk_paste' || params.type === 'BULK_LIST') && (params.text || params.bulkId)) {
        if (params.bulkId) {
            message = `Hi, I'm analyzing a Bulk List (ID: ${params.bulkId}) with ${params.itemCount || '?'} items.\n\nPlease provide pricing.`;
        } else {
            message = `Hi, I have a list of parts to quote:\n\n${params.text}\n\nPlease prioritize these.`;
        }
    } else {
        message = "Hi, I'm looking for heavy machinery parts.";
    }

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
