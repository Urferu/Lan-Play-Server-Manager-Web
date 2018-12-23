/********************************************************************************************************
      FECHA:  08/09/2017.
DESCRIPCION:  CORRESPONDE A LAS CATEGORIAS DEL MENÚ DE LA UTILERIA CENTRALIZADOR CON FRAMEWORK.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
CREATE TABLE cat_uc_menu_categorias
(
	idu_menu_categoria smallint NOT NULL,
	
	nom_menu_categoria varchar(50) NOT NULL,
	nom_icono varchar(50),
	num_orden smallint NOT NULL,
	opc_activo boolean not null default true,
	
	CONSTRAINT pk_cat_uc_menu_categorias PRIMARY KEY (idu_menu_categoria),
	CONSTRAINT uq_nom_menu_categoria UNIQUE (nom_menu_categoria)
);