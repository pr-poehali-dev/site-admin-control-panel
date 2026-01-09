-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100) UNIQUE NOT NULL,
    rank VARCHAR(50) NOT NULL,
    rank_date DATE NOT NULL,
    position VARCHAR(100) NOT NULL,
    position_date DATE NOT NULL,
    avatar TEXT,
    pending_avatar TEXT,
    bio TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы наград
CREATE TABLE awards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы награждений (связь пользователей и наград)
CREATE TABLE user_awards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    award_id INTEGER REFERENCES awards(id),
    awarded_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, award_id)
);

-- Создание таблицы новостей
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author_id INTEGER REFERENCES users(id),
    reactions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы реакций на новости
CREATE TABLE news_reactions (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, user_id)
);

-- Создание таблицы заявок на смену аватара
CREATE TABLE avatar_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    avatar_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы информационных разделов
CREATE TABLE info_sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы подразделений
CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы разделов устава
CREATE TABLE charter_sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_users_code ON users(code);
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_news_created ON news(created_at DESC);
CREATE INDEX idx_user_awards_user ON user_awards(user_id);
CREATE INDEX idx_user_awards_award ON user_awards(award_id);
CREATE INDEX idx_avatar_requests_status ON avatar_requests(status);

-- Вставка тестовых данных
INSERT INTO users (code, nickname, rank, rank_date, position, position_date, role) VALUES
('ADMIN001', 'Генерал Командир', 'Генерал', '2025-01-01', 'Командующий', '2025-01-01', 'admin'),
('MOD001', 'Полковник Петров', 'Полковник', '2025-12-20', 'Инструктор', '2025-12-25', 'moderator'),
('USER001', 'Сержант Сидоров', 'Сержант', '2026-01-07', 'Боец', '2026-01-07', 'user');

INSERT INTO awards (name, icon) VALUES
('Медаль "За отвагу"', '🎖️'),
('Орден "За службу"', '🏅'),
('Медаль "За выслугу лет"', '🥇');

INSERT INTO user_awards (user_id, award_id, awarded_date) VALUES
(1, 1, '2025-12-01'),
(1, 3, '2025-11-20'),
(2, 1, '2025-12-15');

INSERT INTO news (title, content, author_id) VALUES
('Приказ о повышении сержантского состава', 'В соответствии с графиком повышений объявляется о присвоении очередных званий сержантскому составу. Повышения состоятся в субботу в 20:00 по МСК. Все кандидаты должны явиться на построение.', 1),
('Открыта запись в Офицерскую Академию', 'Начат набор в Офицерскую Академию для прапорщиков, желающих получить офицерское звание. Для записи обратитесь к командованию. Экзамены пройдут 15 января.', 2);

INSERT INTO info_sections (title, description, icon, sort_order) VALUES
('Система званий', 'Полная информация о воинских званиях, требованиях к повышению и сроках службы.', 'Star', 1),
('Правила поведения', 'Основные правила поведения на сервере и взаимодействия с другими участниками.', 'Shield', 2),
('Контакты командования', 'Список контактов для связи с командованием и решения организационных вопросов.', 'Phone', 3);

INSERT INTO divisions (title, description, icon, sort_order) VALUES
('Разведывательный отряд', 'Специализируется на сборе разведывательной информации и проведении тайных операций.', 'Search', 1),
('Штурмовая группа', 'Основная боевая единица, специализирующаяся на прямых атаках и захвате территорий.', 'Zap', 2),
('Инженерный корпус', 'Отвечает за строительство укреплений, разминирование и техническую поддержку.', 'Wrench', 3);

INSERT INTO charter_sections (title, content, sort_order) VALUES
('Глава 1. Общие положения', 'Настоящий устав регулирует порядок службы, права и обязанности военнослужащих. Все участники обязаны соблюдать положения устава и следовать приказам командования.', 1),
('Глава 2. Воинские звания', 'Установлены следующие воинские звания: Рядовой, Ефрейтор, Младший сержант, Сержант, Старший сержант, Старшина, Прапорщик, Младший лейтенант, Лейтенант, Старший лейтенант, Капитан, Майор, Подполковник, Полковник, Генерал. Повышение производится согласно графику и требованиям.', 2),
('Глава 3. Дисциплина', 'Воинская дисциплина является обязательным условием службы. Нарушение дисциплины влечёт применение дисциплинарных взысканий: замечание, выговор, понижение в звании, исключение из состава.', 3),
('Глава 4. Порядок повышения', 'Рядовой — Ефрейтор: через 2 дня после КМБ. Ефрейтор — Сержант: дважды в неделю. Сержант — Прапорщик: раз в неделю. Прапорщик — Младший Лейтенант: после Офицерской Академии. Младший Лейтенант — Старший Лейтенант: на офицерском собрании, минимум 10 дней на звании.', 4);