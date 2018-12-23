/********************************************************************************************************
      FECHA:  08/09/2017.
DESCRIPCION:  ES LA TABLA DE PERMISOS DE OPCIONES POR EMPLEADO.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
CREATE TABLE cat_uc_menu_opciones_empleados
(
	idu_empleado INTEGER NOT NULL,
	idu_menu_opcion SMALLINT NOT NULL,
    idu_menu_categoria SMALLINT NOT NULL,
	
	CONSTRAINT pk_cat_uc_menu_opciones_empleados PRIMARY KEY (idu_empleado, idu_menu_opcion, idu_menu_categoria),
	CONSTRAINT fk_cat_uc_menu_opciones_empleados FOREIGN KEY (idu_menu_opcion, idu_menu_categoria)
		REFERENCES cat_uc_menu_opciones (idu_menu_opcion, idu_menu_categoria)
);