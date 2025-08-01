-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-07-2025 a las 23:58:29
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
('Queso campesino', 'libra', 8500, 12, 'Colanta', 'LACTEOS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbusuarios`
--

CREATE TABLE `tbusuarios` (
  `Nombres` varchar(60) NOT NULL,
  `Apellidos` varchar(20) NOT NULL,
  `Id` int(11) NOT NULL,
  `Cedula` int(11) NOT NULL,
  `Contrasena` varchar(40) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Celular` int(12) DEFAULT NULL,
  `TipoUsuario` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbusuarios`
--

INSERT INTO `tbusuarios` (`Nombres`, `Apellidos`, `Id`, `Cedula`, `Contrasena`, `Correo`, `Celular`, `TipoUsuario`) VALUES
('Jose', 'Lopez', 5, 100100103, '69d13878f0d7697f3e93e5d422791f51c7ffc69c', 'joselopez@mail.com', 300300301, 'Tendero'),
('Angie Paola', 'Sierra', 6, 100101200, '63cd62ba30d825b3e6d3b16335a2f2c3', 'angiesierra1@mail.com', 301300301, 'Cliente'),
('Juan pablo', 'Sierra', 7, 100101300, 'd152a7f149d39b5d39284045c0b74f17', 'juanpsierra1@mail.com', 300301303, 'Cliente'),
('Jeninson', 'Peralta', 2, 1001001001, 'bd13cc582e7cad4711a7fe7415f33de4', 'jeninson@mail.com', 301300300, 'Cliente'),
('Juan camilo', 'Ruiz', 4, 1001001020, '61823992b771897478cf61da663c9ebc', 'juancamilo@mail.com', 300300300, 'Tendero'),
('German', 'Sierra rojas', 1, 1015447937, 'e384f4a2344a59c3992b12f372009153', 'germansierra@mail.com', 300300300, 'Cliente'),
('Laura Gisell', 'Saenz', 3, 1022002000, '0b3719f9ea9d7c98a3470519dba89b52', 'laurasaenz@mail.com', 301200300, 'Tendero');

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
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `tbusuarios`
--
ALTER TABLE `tbusuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Filtros para la tabla `tbventas`
--
ALTER TABLE `tbventas`
  ADD CONSTRAINT `TbVentas_fk0` FOREIGN KEY (`Id_ventas`) REFERENCES `tbcompras` (`Id_compra`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
