-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-08-2025 a las 04:21:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mibasededatos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcategorias`
--

CREATE TABLE `tbcategorias` (
  `nombre_categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbcategorias`
--

INSERT INTO `tbcategorias` (`nombre_categoria`) VALUES
('GRANOS'),
('CEREALES'),
('LACTEOS'),
('EMBUTIDOS'),
('FRUTAS'),
('CARNICOS'),
('VERDURAS'),
('OTROS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcompras`
--

CREATE TABLE `tbcompras` (
  `Fecha` date NOT NULL,
  `Id_Cliente` int(11) NOT NULL,
  `Estado` varchar(20) NOT NULL,
  `Medio_de_pago` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblistado`
--

CREATE TABLE `tblistado` (
  `Id_producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbnegocios`
--

CREATE TABLE `tbnegocios` (
  `Nombre_negocio` varchar(60) NOT NULL,
  `Id_tendero` int(11) NOT NULL,
  `Celular` int(11) NOT NULL,
  `Correo` varchar(60) NOT NULL,
  `Direccion` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbproductos`
--

CREATE TABLE `tbproductos` (
  `Nombre` varchar(60) NOT NULL,
  `Medida` varchar(40) NOT NULL,
  `Precio` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Marca` varchar(20) DEFAULT NULL,
  `Categoria` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbproductos`
--

INSERT INTO `tbproductos` (`Nombre`, `Medida`, `Precio`, `Id_Producto`, `Marca`, `Categoria`) VALUES
('Arroz', 'libra', 2000, 1, 'Florhuila', 'OTROS'),
('Manzana Royal', 'libra', 2500, 2, 'N/A', 'FRUTAS'),
('Azucar', 'kilo', 2500, 3, 'Manuelita', 'OTROS'),
('Cebolla larga', 'libra', 600, 4, 'N/A', 'VERDURAS'),
('Mandarina', 'kilo', 3000, 5, 'N/A', 'FRUTAS'),
('Cebolla larga', 'libra', 1400, 6, 'N/A', 'VERDURAS'),
('Aceite girasol', 'litro', 2000, 7, 'Girasoli', 'OTROS'),
('Garbanzo', 'libra', 900, 8, 'Diana', 'GRANOS'),
('Leche entera', 'litro', 5500, 9, 'Alpina', 'LACTEOS'),
('Tomate chonto', 'libra', 1500, 10, 'N/A', 'VERDURAS'),
('Cafe molido', 'libra', 5500, 11, 'Lukafe', 'OTROS'),
('Queso campesino', 'libra', 8500, 12, 'Colanta', 'LACTEOS'),
('Papa criolla', 'libra', 800, 13, 'N/A', 'FRUTAS'),
('Manzana verde', 'libra', 3800, 14, 'N/A', 'FRUTAS'),
('Lomo de cerdo', 'kilo', 13000, 15, 'Fazenda', 'CARNICOS'),
('Pierna pernil de pollo', 'kilo', 21000, 16, 'Bucaneros', 'CARNICOS'),
('Cadera de res', 'kilo', 26500, 17, 'N/A', 'CARNICOS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbsaldos`
--

CREATE TABLE `tbsaldos` (
  `Id` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Saldo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `FechaCreacion` datetime NOT NULL,
  `FechaActualizacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbsaldos`
--

INSERT INTO `tbsaldos` (`Id`, `IdUsuario`, `Saldo`, `FechaCreacion`, `FechaActualizacion`) VALUES
(1, 1, 795000.00, '2025-08-11 19:22:22', '2025-08-11 21:12:31'),
(2, 2, 250000.00, '2025-08-11 21:18:18', '2025-08-11 21:18:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbtransacciones`
--

CREATE TABLE `tbtransacciones` (
  `Id` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Tipo` enum('recarga','retiro') NOT NULL,
  `Monto` decimal(15,2) NOT NULL,
  `EntidadBancaria` varchar(100) NOT NULL,
  `CuentaDestino` varchar(100) DEFAULT NULL,
  `Estado` enum('pendiente','completada','rechazada') NOT NULL DEFAULT 'pendiente',
  `Fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbtransacciones`
--

INSERT INTO `tbtransacciones` (`Id`, `IdUsuario`, `Tipo`, `Monto`, `EntidadBancaria`, `CuentaDestino`, `Estado`, `Fecha`) VALUES
(1, 1, 'recarga', 500000.00, 'DAVIPLATA', 'DAVIPLATA', 'completada', '2025-08-11 19:22:22'),
(2, 1, 'recarga', 250000.00, 'DAVIPLATA', 'DAVIPLATA', 'completada', '2025-08-11 20:04:45'),
(3, 1, 'recarga', 35000.00, 'BANCO AV VILLAS', 'BANCO AV VILLAS', 'completada', '2025-08-11 21:11:07'),
(4, 1, 'recarga', 10000.00, 'DAVIPLATA', 'DAVIPLATA', 'completada', '2025-08-11 21:12:31'),
(5, 2, 'recarga', 250000.00, 'DAVIPLATA', NULL, 'completada', '2025-08-11 21:18:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbusuarios`
--

CREATE TABLE `tbusuarios` (
  `Nombres` varchar(60) NOT NULL,
  `Apellidos` varchar(60) NOT NULL,
  `Id` int(11) NOT NULL,
  `Cedula` varchar(20) NOT NULL,
  `Contrasena` varchar(250) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Celular` bigint(20) DEFAULT NULL,
  `Saldo` decimal(12,2) NOT NULL DEFAULT 0.00,
  `TipoUsuario` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbusuarios`
--

INSERT INTO `tbusuarios` (`Nombres`, `Apellidos`, `Id`, `Cedula`, `Contrasena`, `Correo`, `Celular`, `Saldo`, `TipoUsuario`) VALUES
('Jeninson', 'Peralta', 2, '1001001001', 'bd13cc582e7cad4711a7fe7415f33de4', 'jeninson@mail.com', 301300300, 0.00, 'Cliente'),
('Juan camilo', 'Ruiz', 4, '1001001020', 'a296686bf80637be6cdcf853308b9cf0', 'juancamilo@mail.com', 300300300, 0.00, 'Tendero'),
('Jose', 'Lopez', 5, '100100103', 'b38a452c4585079d78a71012f53a56c4', 'joselopez@mail.com', 300300301, 0.00, 'Tendero'),
('Angie Paola', 'Sierra rojas', 6, '100101200', '63cd62ba30d825b3e6d3b16335a2f2c3', 'angiesierra1@mail.com', 3105864273, 0.00, 'Cliente'),
('Juan pablo', 'Sierra', 7, '100101300', 'd152a7f149d39b5d39284045c0b74f17', 'juanpsierra1@mail.com', 300301303, 0.00, 'Cliente'),
('Blanca lilia', 'Sierra rojas', 8, '100105105', '992670009d6f087bb42b371a1f92bbc4', 'blanca.sierra@mail.com', 312000300, 0.00, 'Cliente'),
('German', 'sierra', 1, '1015447937', '54b09c2334efaf363d29439b051c616c', 'germansierra@mail.com', 3196431760, 0.00, 'Cliente'),
('Laura Gisell', 'Saenz sierra', 3, '1022002000', '0b5bf3c8f9a2f4fb690c5f76afb5ad3b', 'laurasaenz@mail.com', 3104882590, 0.00, 'Tendero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbventas`
--

CREATE TABLE `tbventas` (
  `Id_ventas` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Estado` varchar(20) NOT NULL,
  `Productos` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbcompras`
--
ALTER TABLE `tbcompras`
  ADD PRIMARY KEY (`Id_Cliente`),
  ADD UNIQUE KEY `Id_Cliente` (`Id_Cliente`);

--
-- Indices de la tabla `tblistado`
--
ALTER TABLE `tblistado`
  ADD PRIMARY KEY (`Id_producto`);

--
-- Indices de la tabla `tbnegocios`
--
ALTER TABLE `tbnegocios`
  ADD KEY `TbNegocios_fk1` (`Id_tendero`);

--
-- Indices de la tabla `tbproductos`
--
ALTER TABLE `tbproductos`
  ADD UNIQUE KEY `Id_Producto` (`Id_Producto`);

--
-- Indices de la tabla `tbsaldos`
--
ALTER TABLE `tbsaldos`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IdUsuario` (`IdUsuario`);

--
-- Indices de la tabla `tbtransacciones`
--
ALTER TABLE `tbtransacciones`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdUsuario` (`IdUsuario`);

--
-- Indices de la tabla `tbusuarios`
--
ALTER TABLE `tbusuarios`
  ADD PRIMARY KEY (`Cedula`),
  ADD UNIQUE KEY `Id_usuario` (`Id`),
  ADD UNIQUE KEY `Cedula_usuario` (`Cedula`);

--
-- Indices de la tabla `tbventas`
--
ALTER TABLE `tbventas`
  ADD UNIQUE KEY `Id_ventas` (`Id_ventas`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbproductos`
--
ALTER TABLE `tbproductos`
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `tbsaldos`
--
ALTER TABLE `tbsaldos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbtransacciones`
--
ALTER TABLE `tbtransacciones`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tbusuarios`
--
ALTER TABLE `tbusuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbcompras`
--
ALTER TABLE `tbcompras`
  ADD CONSTRAINT `TbCompras_fk1` FOREIGN KEY (`Id_Cliente`) REFERENCES `tbusuarios` (`Id`);

--
-- Filtros para la tabla `tblistado`
--
ALTER TABLE `tblistado`
  ADD CONSTRAINT `TbListado_fk0` FOREIGN KEY (`Id_producto`) REFERENCES `tbproductos` (`Id_Producto`),
  ADD CONSTRAINT `TbListado_fk2` FOREIGN KEY (`Id_compra`) REFERENCES `tbcompras` (`Id_compra`);

--
-- Filtros para la tabla `tbnegocios`
--
ALTER TABLE `tbnegocios`
  ADD CONSTRAINT `TbNegocios_fk1` FOREIGN KEY (`Id_tendero`) REFERENCES `tbusuarios` (`Id`);

--
-- Filtros para la tabla `tbsaldos`
--
ALTER TABLE `tbsaldos`
  ADD CONSTRAINT `tbsaldos_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `tbusuarios` (`Id`);

--
-- Filtros para la tabla `tbtransacciones`
--
ALTER TABLE `tbtransacciones`
  ADD CONSTRAINT `tbtransacciones_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `tbusuarios` (`Id`);

--
-- Filtros para la tabla `tbventas`
--
ALTER TABLE `tbventas`
  ADD CONSTRAINT `TbVentas_fk0` FOREIGN KEY (`Id_ventas`) REFERENCES `tbcompras` (`Id_compra`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
