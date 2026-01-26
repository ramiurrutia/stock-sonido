
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
            'Microfono',
            'Parlante',
            'Potencia',
            'Tripode',
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

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/Qu16.png', 'CONS-0002', 'Mezcladora Allen & Heath Qu16', 'Consola', 'Guardado', 'Audio | 1 unidad | Modelo Qu16');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/UMC202HD.png', 'ACCS-0001', 'Placa USB Behringer UMC202 HD', 'Accesorio', 'Guardado', 'Audio | Interfaz USB');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/Tablero_Electrico.png', 'ELEC-0002', 'Tablero Eléctrico', 'Electricidad', 'Guardado', '220V | 17 salidas | 10A | 1 ficha Scame 32A'),
('/assets/Tablero_Trifasico.png', 'ELEC-0003', 'Tablero Trifásico', 'Electricidad', 'Guardado', '380V | 3P+N+T | 2x16A 220V + 1x32A 220V');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/XLI1500.png', 'POTE-0002', 'Potencia Crown XLI 1500', 'Potencia', 'Guardado', '900W 4Ω por canal'),
('/assets/XLI1500.png', 'POTE-0003', 'Potencia Crown XLI 1500', 'Potencia', 'Guardado', '900W 4Ω por canal');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/ECM8000.png', 'MICR-0002', 'Microfono Behringer ECM 8000', 'Microfono', 'Guardado', 'Medición acústica'),
('/assets/SM58.png', 'MICR-0003', 'Microfono Shure SM-58', 'Microfono', 'Guardado', ''),
('/assets/SM58.png', 'MICR-0004', 'Microfono Shure SM-58', 'Microfono', 'Guardado', ''),
('/assets/SM58.png', 'MICR-0005', 'Microfono Shure SM-58', 'Microfono', 'Guardado', ''),
('/assets/SM58.png', 'MICR-0006', 'Microfono Shure SM-58', 'Microfono', 'Guardado', ''),
('/assets/SM58.png', 'MICR-0007', 'Microfono Shure SM-58', 'Microfono', 'Guardado', ''),
('/assets/D8000.png', 'MICR-0008', 'Microfono AKG D8000', 'Microfono', 'Guardado', ''),
('/assets/D108.png', 'MICR-0009', 'Microfono Superlux D108', 'Microfono', 'Guardado', ''),
('/assets/BETA58A.png', 'MICR-0010', 'Microfono Shure Beta 58A', 'Microfono', 'Guardado', ''),
('/assets/BETA58A.png', 'MICR-0011', 'Microfono Shure Beta 58A', 'Microfono', 'Guardado', '');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/PR15.png', 'PARL-0002', 'Parlante Peavey PR15', 'Parlante', 'Guardado', 'Pasivo | 400W'),
('/assets/PR15.png', 'PARL-0003', 'Parlante Peavey PR15', 'Parlante', 'Guardado', 'Pasivo | 400W'),
('/assets/PV12M.png', 'PARL-0004', 'Parlante Peavey PV-12M', 'Parlante', 'Guardado', 'Pasivo | 500W'),
('/assets/TS212.png', 'PARL-0005', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/TS212.png', 'PARL-0006', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/TS212.png', 'PARL-0007', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/TS212.png', 'PARL-0008', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/TS212.png', 'PARL-0009', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/TS212.png', 'PARL-0010', 'Parlante Alto TS212', 'Parlante', 'Guardado', 'Activo | 550W'),
('/assets/AC-8A.png', 'PARL-0011', 'Parlante Acustica AC-8A', 'Parlante', 'Guardado', 'Activo | 100W');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/Patchera.png', 'ACCS-0002', 'Pachera Lexsen Patch-16', 'Accesorio', 'Guardado', '30 metros | 12 entradas / 4 retornos');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/Tripode.png', 'TRIP-0002', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros'),
('/assets/Tripode.png', 'TRIP-0003', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros'),
('/assets/Tripode.png', 'TRIP-0004', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros'),
('/assets/Tripode.png', 'TRIP-0005', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros'),
('/assets/Tripode.png', 'TRIP-0006', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros'),
('/assets/Tripode.png', 'TRIP-0007', 'Pie de Parlante', 'Tripode', 'Guardado', 'Altura 2,5 metros');

INSERT INTO items (image_url, code, name, category, status, notes) VALUES
('/assets/CANON.png', 'CABL-0002', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0003', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0004', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0005', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0006', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0007', 'Cable Canon (14 mts.)', 'Cable', 'Guardado', '14 m'),
('/assets/CANON.png', 'CABL-0008', 'Cable Canon (3 mts.)', 'Cable', 'Guardado', '3 m'),
('/assets/CANON.png', 'CABL-0009', 'Cable Canon (3 mts.)', 'Cable', 'Guardado', '3 m'),
('/assets/CANON.png', 'CABL-0010', 'Cable Canon (3 mts.)', 'Cable', 'Guardado', '3 m'),
('/assets/CANON.png', 'CABL-0011', 'Cable Canon (3 mts.)', 'Cable', 'Guardado', '3 m'),
('/assets/CANON.png', 'CABL-0012', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0013', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0014', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0015', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0016', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0017', 'Cable Canon (15 mts.)', 'Cable', 'Guardado', '15 m'),
('/assets/CANON.png', 'CABL-0018', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0019', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0020', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0021', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0022', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0023', 'Cable Canon (7 mts.)', 'Cable', 'Guardado', '7 m'),
('/assets/CANON.png', 'CABL-0024', 'Cable Canon (1 mts.)', 'Cable', 'Guardado', '1 m'),
('/assets/CANON.png', 'CABL-0025', 'Cable Canon (5 mts.)', 'Cable', 'Guardado', '5 m'),
('/assets/CANON.png', 'CABL-0026', 'Cable Canon (18 mts.)', 'Cable', 'Guardado', '18 m'),
('/assets/CANON.png', 'CABL-0027', 'Cable Canon (2 mts.)', 'Cable', 'Guardado', '2 m'),
('/assets/CANON.png', 'CABL-0028', 'Cable Canon (21 mts.)', 'Cable', 'Guardado', '21 m'),
('/assets/CANON.png', 'CABL-0029', 'Cable Canon (4 mts.)', 'Cable', 'Guardado', '4 m'),
('/assets/CANON.png', 'CABL-0030', 'Cable Canon (9 mts.)', 'Cable', 'Guardado', '9 m');

INSERT INTO items (code, name, category, status, notes) VALUES
('ANVI-0001', 'Anvil de Cables', 'Anvil', 'Guardado', '');