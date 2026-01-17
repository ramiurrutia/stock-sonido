
CREATE TABLE items
(
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (
        category IN (
            'Cable',
            'Consola',
            'Micrófono',
            'Parlante',
            'Potencia',
            'Trípode',
            'Electricidad',
            'Accesorio',
            'Anvil'
        )
    ),
    status VARCHAR(20) NOT NULL DEFAULT 'Guardado' CHECK (
        status IN (
            'Guardado',
            'En uso',
            'Enviado',
            'Baja'
        )
    ),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE anvil_contents
(
    id SERIAL PRIMARY KEY,

    anvil_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,

    notes TEXT,
    moved_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_anvil
        FOREIGN KEY (anvil_id)
        REFERENCES items(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_item_in_anvil
        UNIQUE (item_id),

    CONSTRAINT anvil_not_equal_item
        CHECK (anvil_id <> item_id)
);

CREATE TABLE movements
(
    id SERIAL PRIMARY KEY,

    item_id INTEGER NOT NULL,
    anvil_id INTEGER,

    action VARCHAR(50) NOT NULL,

    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,

    user_name VARCHAR(255),

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_movement_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_movement_anvil
        FOREIGN KEY (anvil_id)
        REFERENCES items(id)
        ON DELETE SET NULL,

    CONSTRAINT valid_action
        CHECK (action IN (
            'status_change',
            'assign_anvil',
            'remove_anvil',
            'manual_update'
        ))
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    
    destination VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    
    sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expected_return_at DATE,
    returned_at TIMESTAMP,
    
    notes TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE shipment_items (
    id SERIAL PRIMARY KEY,
    
    shipment_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    
    quantity INTEGER DEFAULT 1,
    notes TEXT,
    
    CONSTRAINT fk_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_items_code ON items(code);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_movements_item_id ON movements(item_id);
CREATE INDEX idx_movements_created_at ON movements(created_at);
CREATE INDEX idx_shipment_items_shipment_id ON shipment_items(shipment_id);
CREATE INDEX idx_shipment_items_item_id ON shipment_items(item_id);


INSERT INTO items (code, name, category, status, notes)
VALUES
    ('CABL-0001', 'Cable CANON (XLR) | 14 mts.', 'Cable', 'Guardado', 'Cable de audio XLR de 14 metros de longitud. De consola a micrófono.'),
    ('CONS-0001', 'Consola Qu16 | Allen & Heath', 'Consola', 'Guardado', 'Consola de mezcla digital de 16 canales.'),
    ('MICR-0001', 'Micrófono Shure | SM-58', 'Micrófono', 'Guardado', 'Micrófono dinámico para voces.'),
    ('PARL-0001', 'Monitor Peavey (Pasivo) | PV-12M', 'Parlante', 'Guardado', '500W'),
    ('POTE-0001', 'Potencia Crown | XLI 1500', 'Potencia', 'Guardado', '900W (4 ohmios p/canal).'),
    ('TRIP-0001', 'Trípode de parlante | 2,5m', 'Trípode', 'Guardado', ''),
    ('ELEC-0001', 'Tablero electrico', 'Electricidad', 'Guardado', '220V. Tablero con 17 salidas, 10 AMP, 1 ficha Scame 220V x 32 AMP.');