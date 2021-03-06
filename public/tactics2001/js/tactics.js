// JavaScript Document

var board_count_num;
var chessboard_list = []

//Letter2Chesscode
var letter2chess = {
    "wK": "&#9812;",
    "wQ": "&#9813;",
    "wR": "&#9814;",
    "wB": "&#9815;",
    "wN": "&#9816;",
    "wP": "&#9817;",
    "bK": "&#9818;",
    "bQ": "&#9819;",
    "bR": "&#9820;",
    "bB": "&#9821;",
    "bN": "&#9822;",
    "bP": "&#9823;",
}

function change_tag(n) {
    var panels = $("main").find(".examples-body-9af4d");
    panels.each(function () {
        $(this).css("display", "none");
    })
    //console.log("change nav tag" + n.toString());
    panels.eq(n).css("display", "");
}

function init() {
    //set nav tag
    var nav_tags = $("#groupContainer-1").find("li");
    nav_tags.each(function () {
        var data_id = $(this).data("id");
        $(this).click(function () {
            nav_tags.each(function () {
                $(this).removeClass("active");
            })
            $(this).addClass("active");
            change_tag(data_id);
        });
    })
    //set dafault tag
    nav_tags.eq(0).trigger("click");

    //init code
    board_count_num = 0;

    // example 1
    var board1 = Chessboard('board1', 'start')

    // example 2
    var board2 = Chessboard('board2', {
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true,
        showNotation: false,
    })

    //test: init tactics
    var des_str = "159 Panda Miao USA 1991 I g 1.? +-";
    var fes_str = 'r2qr1k1/1pnb1pp1/p1n1p2p/8/P2P3P/B2B1NP1/6P1/R2Q1RK1 w - - 0 1';
    create_one_tactic(des_str, fes_str, "no solution");

    board_count_num++;

    init_menu();

    change_page(true, init = true);
    //load_tactic_from_book();

    //console.log(board_count_num);
    //console.log(chessboard_list.length);

}

function create_one_tactic(descriptions, FEN, solution) {
    /*
    create one chess tactic board from FEN
    descriptions: [no. white black place year class tactic who_move result]
    e.g 159 Panda Miao USA 1991 I g 1.? +-
    FEN: chess FEN board
    solution: solution string
    */
    var info_list = descriptions.split(' ');
    var new_board_id = "tacticboard_" + board_count_num.toString();

    var tactic_block = $('#tacticblock_' + board_count_num.toString()); //

    var block_header = $("<h5 class=\"title-number\">" + info_list[0] + "</h5><h5>" + info_list[1] + " vs " + info_list[2] + " </h5>"
        + "<div style=\"display: flex\"><div style=\"flex-grow: 1;\"> <h5>"
        + info_list[3] + " " + info_list[4] + "</h5></div>" + "<div><h5>" + info_list[5] + " " + info_list[6] + "</h5></div>" + "</div>");
    var block_main = $("<div id=\"" + new_board_id + "\" class=\"small-board\">");
    var block_footer = $("<div style=\"display: flex\"><div style=\"flex-grow: 1;\">"
        + info_list[7] + "</div>" + "<div>" + info_list[8] + "</div>" + "</div>");

    tactic_block.append(block_header);
    tactic_block.append(block_main);
    tactic_block.append(block_footer);


    var new_board = Chessboard(new_board_id, {
        position: FEN,
        showNotation: false,
    });

    return new_board;
}

function load_tactic_from_book(page = 0, my_book = book) {
    var main_container = $('#realBodyContainer');

    //change page 
    main_container.empty();
    board_count_num = 1;
    while (chessboard_list.length) {
        chessboard_list.pop();
    }

    //load tactic from book
    for (var i = 0; i < 3; i++) {
        var row_container = $("<div></div>").addClass("container-4e1ee");
        main_container.append(row_container);
        for (var j = 0; j < 3; j++) {
            if (9 * page + 3 * i + j >= my_book.length) {
                break;
            }
            var book_item = my_book[9 * page + 3 * i + j];

            //console.log("tacticblock_" + board_count_num.toString());

            var block_container = make_hover_card("tacticblock_" + board_count_num.toString(), book_item);
            //$("<div id=\"tacticblock_" + board_count_num.toString() + "\"></div>").addClass("tactic_block");


            row_container.append(block_container);

            var chess_board = create_one_tactic(book_item['description'], book_item['FEN'], book_item['solution']);

            chessboard_list.push(chess_board);

            //set up flip board
            var flip_button = block_container.find('.flip-board-button');
            flip_button.attr("id", "flip_button_" + board_count_num.toString());

            var id_num = board_count_num;
            flip_button.click(function () {
                console.log($(this).attr("id"));
                var button_id = $(this).attr("id");
                var board_index = button_id.charAt(button_id.length - 1);
                chessboard_list[board_index - 1].flip();
            });

            board_count_num++;
        }
    }
}

function make_hover_card(block_id, book_item, FEN = "") {
    //set card
    var card = $(`
	        <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <div class="tactic_block" id="${block_id}"> </div>
                    </div>
                    <div class="flip-card-back">
                            <div class="btn-group" role="group" style="margin-top:10px;">
                                <button type="button" class="btn btn-outline-primary show-answer-button" style="font-size:12px">Show answer</button>
								<button type="button" class="btn btn-outline-primary flip-board-button" style="font-size:12px">Flip board</button>
                            </div>
                            <div class="scrollable">
                                <p class="tactic-answer">${solution_string2chess_code(book_item['solution'])}</p>
                            </div>
                            <div> <span>Copy:</span>
                                <div class="btn-group" role="group" aria-label="Basic outlined example">
									<button type="button" class="btn btn-outline-primary copy-fen-button">FEN</button>
                                    <button type="button" class="btn btn-outline-primary copy-pgn-button">PGN</button>      
                                </div>
                            </div>
							<div class="copy-notification" style="visibility:hidden;"><p>Copied successfully </br> (analyze in <a href="https://www.chess.com/analysis" target="_blank">chess.com </a>)</p></div>
                    </div>
                </div>
            </div>`);

    // set fade effect
    /*card.hover(function () {
        var fade_object = $(this).find(".tactic_block");
		$(this).removeClass("block-lock");
        setTimeout(function () {
			
            console.log(fade_object.attr('class'));
            if (!$(this).hasClass("block-lock")) {
                fade_object.css("display", "none");
            }
        }, 1000);
    }, function () {
        var fade_object = $(this).find(".tactic_block");
        console.log(fade_object.attr('class'));
        fade_object.css("display", "block");
        $(this).addClass("block-lock");
    })*/


    //make scrolled anser
    var scroll_part = card.find('.scrollable');
    scroll_part.css("visibility", "hidden");

    //set up answer botton
    var show_button = card.find('.show-answer-button');

    show_button.click(function () {
        if (scroll_part.css("visibility") == "hidden") {
            scroll_part.css("visibility", "visible");
            show_button.text("Hide answer");
        } else {
            scroll_part.css("visibility", "hidden");
            show_button.text("Show answer");
        }

    })

    //set up flip board

    //set up copy
    var copy_fen_button = card.find(".copy-fen-button");
    var copy_notification = card.find(".copy-notification");
    var copy_pgn_button = card.find(".copy-pgn-button");

    copy_fen_button.click(function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(book_item['FEN']).select();
        document.execCommand("copy");
        $temp.remove();

        copy_notification.css("visibility", "visible");
    })

    copy_pgn_button.click(function () {
        var $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val(book_item['PGN']).select();
        document.execCommand("copy");
        $temp.remove();

        copy_notification.css("visibility", "visible");
    })

    return card;
}

//change page for loading tactics
function change_page(next_page = true, init = false, page = 0, my_book = book) {
    //change page
    var page_id = parseInt($("#pageId").text());
    if (next_page)
        page_id++;
    else
        page_id--;

    var max_page = Math.ceil(my_book.length / 9)
    //console.log("max_page " + max_page.toString());

    if (init) {
        page_id = 1;
        make_pagination(max_page, my_book);
    } else if (page > 0) {
        page_id = page;
    }

    //console.log("change_paged page_id " + page_id.toString());
    //change page
    set_pagination(page_id, max_page, my_book);

    $("#pageId").text(page_id.toString());

    load_tactic_from_book(page_id - 1, my_book);

    /*//disable previous page
    var previous_page_li = $("#previousPageLi");
    var next_page_li = $("#nextPageLi");
    if (page_id == 1) {
        previous_page_li.addClass("disabled");
    } else {
        if (previous_page_li.hasClass("disabled"))
            previous_page_li.removeClass("disabled");
    }

    if (page_id * 9 >= book.length) {
        next_page_li.addClass("disabled");
    } else {
        if (next_page_li.hasClass("disabled"))
            next_page_li.removeClass("disabled");
    }*/

}

//parse solution string into chess code
function solution_string2chess_code(solution) {
    //solution 1. Bxh7+ Kxh7 2. Ne4 +- (2. Ne4 Be7 3. Nf6+ gxf6
    var new_solution = ""
    var color = "w" // or "b"
    for (var i = 0; i < solution.length; i++) {
        var c = solution.charAt(i);
        // it is a number
        if (c >= '0' && c <= '9') {
            if (i < solution.length - 1) {
                if (solution.charAt(i + 1) == ".") {
                    color = "w";
                    if (i < solution.length - 2) {
                        if (solution.charAt(i + 2) == ".") {
                            color = "b";
                        }
                    }
                }
            }
            new_solution += c;
        }
        //is char
        else if (c >= "A" && c <= "Z") {
            var piece = color + c;
            var chess_code = letter2chess[piece];
            new_solution += chess_code
            if (color == "w") {
                color = "b";
            }
        } else {
            new_solution += c;
        }
    }

    return new_solution;
}

//make pagination 
function make_pagination(max_page, my_book = book) {
    //console.log("init make_pagination");
    var page_ul = $("#pageUl");
    var page_ul_li = page_ul.children();
    for (var i = 1; i < page_ul_li.length - 1; i++) {
        page_ul_li.eq(i).remove();
    }

    //previous and next page buttons
    var previous_page = $("#pageUl li:first-child");
    var next_page = $("#pageUl li:last-child");
    previous_page.unbind("click");
    previous_page.click(function () {
        change_page(false, false, 0, my_book);
    })
    next_page.unbind("click");
    next_page.click(function () {
        change_page(true, false, 0, my_book);
    })

    for (var i = 1; i <= max_page; i++) {
        var page_li = $(`<li class="page-item"><a class="page-link" href="#">${i.toString()}</a></li>`);
        page_li.insertBefore(next_page);
        var page_link = page_li.find("a");
        page_link.attr("page_num", i.toString());
        page_link.click(function () {
            var page_num = $(this).attr("page_num");
            console.log("setpage!" + page_num);
            change_page(true, false, page_num, my_book);
        });
    }


}

//set pagination
function set_pagination(page, max_page, my_book = book) {
    var page_ul = $("#pageUl");
    var previous_page_li = $("#pageUl li:first-child");
    var next_page_li = $("#pageUl li:last-child");


    if (page == 1) {
        previous_page_li.unbind("click");
        previous_page_li.addClass("disabled");
    } else {
        if (previous_page_li.hasClass("disabled"))
            previous_page_li.removeClass("disabled");
        previous_page_li.unbind("click");
        previous_page_li.click(function () {
            change_page(false, false, 0, my_book);
        })
    }

    if (page >= max_page) {
        next_page_li.unbind("click");
        next_page_li.addClass("disabled");
    } else {
        if (next_page_li.hasClass("disabled"))
            next_page_li.removeClass("disabled");
        next_page_li.unbind("click");
        next_page_li.click(function () {
            change_page(true, false, 0, my_book);
        })
    }

    var ul_children = page_ul.children();
    //
    for (var i = 2; i < ul_children.length - 2; i++) {
        //console.log(ul_children);
        var child_i = ul_children.eq(i);
        if (page - i == 3 || i - page == 3) {
            child_i.css("display", "");
            child_i.find("a").text("...");
            child_i.addClass("disabled");

        } else if (page - i > 3 || i - page > 3) {
            child_i.css("display", "none");
        } else {
            child_i.css("display", "");
            child_i.find("a").text(i.toString());
            child_i.removeClass("disabled");
        }

        child_i.find("a").removeClass("bg-page");

    }
    for (var i = 1; i < ul_children.length - 1; i++) {
        if (i != page) {
            ul_children.eq(i).find("a").removeClass("bg-page");
        } else {
            ul_children.eq(page).find("a").addClass("bg-page");
        }
    }
}

//set menu selection button
function init_menu() {
    //console.log("init menu");
    //set piece 
    var drop_menu_button1 = $("#dropdownMenu1");
    var drop_menu1 = drop_menu_button1.next();

    var menu1_button_children = drop_menu1.children();
    //console.log("init menu menu1_button_children " + menu1_button_children.length.toString());
    for (var i = 0; i < menu1_button_children.length; i++) {
        var button_child = menu1_button_children.eq(i);
        //var button_data_id = button_child.data("id");
        button_child.click(function () {
            //change id
            drop_menu_button1.data("id", $(this).data("id"));
            //change image src
            var image_src = $(this).find(">:first-child").attr("src");
            console.log(drop_menu_button1.data("id") + " " + image_src);
            drop_menu_button1.find(">:first-child").attr("src", image_src);

            change_book_from_menu_button();
        })
    }

    var piece_note = drop_menu_button1.data("id");

    //var piece_book = book.filter(book_item => book_item["piece"] == piece_note);
    //var own_notes = [];
    //for (var i = 0; i < piece_book.length; i++) {
    //    book_item = piece_book[i];
    //    if (!own_notes.includes(book_item["part"])) {
    //        own_notes.push(book_item["part"]);
    //    }
    //}

    //set note
    var drop_menu_button2 = $("#dropdownMenu2");
    var drop_menu2 = drop_menu_button2.next();

    //console.log(drop_menu2);
    var button_children = drop_menu2.children();
    //console.log(button_children.length);
    for (var i = 0; i < button_children.length; i++) {
        var button_child = button_children.eq(i);
        var button_child_text = button_child.text();
        //check if book has the piece
        //if (own_notes.includes(button_child_text)) {
        //    button_child.css("display", "");
        //} else {
        //    button_child.css("display", "none");
        //}
        //button_child.unbind("click");
        button_child.click(function () {
            drop_menu_button2.data("id", $(this).data("id"));
            //console.log(drop_menu_button2.data("id"));
            drop_menu_button2.text(" " + $(this).text() + " ");
            change_book_from_menu_button();
        })
    }

    //set theme
    var drop_menu_button3 = $("#dropdownMenu3");
    var drop_menu3 = drop_menu_button3.next();

    var menu3_button_children = drop_menu3.children();
    for (var i = 0; i < menu3_button_children.length; i++) {
        var button_child = menu3_button_children.eq(i);
        var button_child_text = menu3_button_children.text();
        //button_child.unbind("click");
        button_child.click(function () {
            drop_menu_button3.data("id", $(this).data("id"));
            //console.log(drop_menu_button2.data("id"));
            drop_menu_button3.text(" " + $(this).text() + " ");
            change_book_from_menu_button();
        })
    }

    //set combination type
    var drop_menu_button4 = $("#dropdownMenu4");
    var drop_menu4 = drop_menu_button4.next();

    var menu4_button_children = drop_menu4.children();
    for (var i = 0; i < menu4_button_children.length; i++) {
        var button_child = menu4_button_children.eq(i);
        var button_child_text = menu4_button_children.text();
        //button_child.unbind("click");
        button_child.click(function () {
            drop_menu_button4.data("id", $(this).data("id"));
            //console.log(drop_menu_button2.data("id"));
            drop_menu_button4.text(" " + $(this).text() + " ");
            change_book_from_menu_button();
        })
    }
}

//change book from menu button 
function change_book_from_menu_button() {
    var piece = $("#dropdownMenu1").data("id");
    var note = $("#dropdownMenu2").data("id");
    var theme = $("#dropdownMenu3").data("id");
    var combination = $("#dropdownMenu4").data("id");


    if (piece == "0") {
        var filter_book = book;
    } else {
        var filter_book = book.filter(book_item => book_item["piece"] == piece);
    }

    if (note == "0") {} else {
        filter_book = filter_book.filter(book_item => book_item["part"] == note);
    }

    if (theme == "0") {} else {
        filter_book = filter_book.filter(book_item => book_item["class"] == theme);
    }

    if (combination == "0") {} else {
        filter_book = filter_book.filter(book_item => book_item["strategy"] == combination);
    }


    //var filter_book = book.filter(book_item => book_item["piece"] == piece && book_item["part"] == note);
    change_page(next_page = true, init = true, page = 0, my_book = filter_book);
}
