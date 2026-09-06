CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    weight_grams REAL NOT NULL CHECK (weight_grams > 0),
    karat INTEGER NOT NULL DEFAULT 18 CHECK (karat IN (18, 24)),
    labor_percent REAL NOT NULL DEFAULT 0 CHECK (labor_percent >= 0),
    profit_percent REAL NOT NULL DEFAULT 0 CHECK (profit_percent >= 0),
    tax_percent REAL NOT NULL DEFAULT 0 CHECK (tax_percent >= 0),
    stock_status TEXT NOT NULL DEFAULT 'in-stock' CHECK (stock_status IN ('in-stock', 'limited', 'out-of-stock')),
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_active_category
ON products(active, category);

CREATE INDEX IF NOT EXISTS idx_products_active_stock
ON products(active, stock_status);

INSERT OR IGNORE INTO products
(product_id, sku, name, category, subcategory, weight_grams, karat, labor_percent, profit_percent, tax_percent, stock_status, active, created_at, updated_at)
VALUES
('1','WG-0001','انگشتر ساده مخصوص هدیه','اقتصادی','انگشتر',1.2,18,3,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('2','WG-0002','گوشواره میخی مخصوص هدیه','اقتصادی','گوشواره',0.8,18,4,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('3','WG-0003','پلاک کوچک مخصوص هدیه','اقتصادی','آویز',0.5,18,5,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('4','WG-0004','انگشتر نگین‌دار','انگشتر',NULL,2.5,18,6,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('5','WG-0005','انگشتر حلقه‌ای','انگشتر',NULL,1.8,18,5,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('6','WG-0006','انگشتر مردانه','مردانه',NULL,4.2,18,7,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('7','WG-0007','آویز قلب','آویز',NULL,1.5,18,8,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('8','WG-0008','آویز ستاره','آویز',NULL,1.2,18,6,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('9','WG-0009','النگو ساده','النگو',NULL,15.5,18,4,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('10','WG-0010','النگو طرح‌دار','النگو',NULL,18.2,18,9,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('11','WG-0011','گوشواره آویزی','گوشواره',NULL,1.8,18,8,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('12','WG-0012','گوشواره میخی','گوشواره',NULL,0.9,18,5,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('13','WG-0013','گردنبند زنجیری','گردنبند',NULL,5.5,18,6,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('14','WG-0014','گردنبند با پلاک','گردنبند',NULL,3.2,18,7,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('15','WG-0015','دستبند زنجیری','دستبند',NULL,4.5,18,6,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('16','WG-0016','دستبند النگویی','دستبند',NULL,8.2,18,7,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('17','WG-0017','انگشتر مردانه ساده','مردانه',NULL,5.8,18,5,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('18','WG-0018','زنجیر مردانه','مردانه',NULL,12.5,18,10,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('19','WG-0019','دستبند چرم مشکی مخصوص هدیه','اقتصادی','دستبند',0.24,18,2,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('20','WG-0020','دستبند چرم قهوه‌ای مخصوص هدیه','اقتصادی','دستبند',0.28,18,2,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('21','WG-0021','دستبند چرم مینیمال مخصوص هدیه','اقتصادی','دستبند',0.32,18,3,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z'),
('22','WG-0022','دستبند چرم باریک مخصوص هدیه','اقتصادی','دستبند',0.35,18,3,7,0,'in-stock',1,'2026-09-06T00:00:00.000Z','2026-09-06T00:00:00.000Z');