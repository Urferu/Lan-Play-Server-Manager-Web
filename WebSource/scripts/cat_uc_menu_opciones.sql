/********************************************************************************************************
      FECHA:  08/09/2017.
DESCRIPCION:  CORRESPONDE A LAS OPCIONES DEL MENÚ DE LA UTILERIA CENTRALIZADOR CON FRAMEWORK.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
CREATE TABLE cat_uc_menu_opciones
(
	idu_menu_opcion smallint NOT NULL,
	idu_menu_categoria smallint NOT NULL,
	
	nom_menu_opcion varchar(50) NOT NULL,
	des_url varchar(100) NOT NULL,
	nom_state varchar(100) not null,
	num_orden smallint NOT NULL,
	opc_activo boolean not null default true,
	
	CONSTRAINT pk_cat_uc_menu_opciones PRIMARY KEY (idu_menu_opcion, idu_menu_categoria),
	CONSTRAINT fk_cat_menu_opciones_cat_menu_categorias FOREIGN KEY (idu_menu_categoria)
		REFERENCES cat_uc_menu_categorias (idu_menu_categoria),
	CONSTRAINT uq_nom_menu_opcion UNIQUE (nom_menu_opcion)
);